# Разбор CSV-выгрузки k6 (--out csv=...) и построение графиков
# python3 analyze.py latency|stress|soak
import csv
import sys
from collections import defaultdict

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt


def p95(values):
    if not values:
        return 0
    s = sorted(values)
    return s[min(len(s) - 1, int(len(s) * 0.95))]


def avg(values):
    return sum(values) / len(values) if values else 0


def read(path):
    with open(path, newline='') as f:
        yield from csv.DictReader(f)


def latency():
    by_level = defaultdict(list)
    fails = defaultdict(int)
    for r in read('results/latency.csv'):
        if r['metric_name'] != 'http_req_duration':
            continue
        level = int(r['scenario'].split('_')[1])
        by_level[level].append(float(r['metric_value']))
        if r['status'] != '200':
            fails[level] += 1

    levels = sorted(by_level)
    print('VU | запросов | avg, ms | med, ms | p95, ms | ошибок')
    rows = []
    for v in levels:
        d = sorted(by_level[v])
        row = (v, len(d), avg(d), d[len(d) // 2], p95(d), fails[v])
        rows.append(row)
        print(f'{row[0]} | {row[1]} | {row[2]:.1f} | {row[3]:.1f} | {row[4]:.1f} | {row[5]}')

    plt.figure(figsize=(8, 4.5))
    plt.plot(levels, [r[2] for r in rows], 'o-', label='avg')
    plt.plot(levels, [r[3] for r in rows], 's-', label='median')
    plt.plot(levels, [r[4] for r in rows], '^-', label='p95')
    plt.xlabel('Виртуальные пользователи (VU)')
    plt.ylabel('Latency, мс')
    plt.title('jsonplaceholder.typicode.com: latency vs VU')
    plt.grid(alpha=0.3)
    plt.legend()
    plt.tight_layout()
    plt.savefig('results/latency-vs-vus.png', dpi=120)


def windows(path, size, metric_filter):
    """группируем по окнам в size секунд"""
    t0 = None
    win = defaultdict(lambda: {'dur': [], 'err': 0, 'n': 0, 'vus': 0, 'reqs': 0, 'extra': defaultdict(list)})
    for r in read(path):
        t = int(r['timestamp'])
        t0 = t if t0 is None else t0
        w = win[(t - t0) // size]
        name = r['metric_name']
        if name == 'vus':
            w['vus'] = max(w['vus'], int(float(r['metric_value'])))
        elif name == 'http_reqs':
            w['reqs'] += 1
        elif name == 'http_req_duration' and metric_filter(r):
            w['dur'].append(float(r['metric_value']))
            w['n'] += 1
            if r['status'] != '200':
                w['err'] += 1
        elif name.startswith('server_'):
            w['extra'][name].append(float(r['metric_value']))
    return [(k * size, win[k]) for k in sorted(win)]


def stress():
    size = 5
    data = windows('results/stress.csv', size, lambda r: r['url'].endswith('/api/auth'))
    t = [x[0] for x in data]
    vus = [x[1]['vus'] for x in data]
    lat = [p95(x[1]['dur']) for x in data]
    err = [100 * x[1]['err'] / x[1]['n'] if x[1]['n'] else 0 for x in data]
    rps = [x[1]['reqs'] / size for x in data]

    print('t, c | VU | RPS | auth p95, ms | ошибки auth, %')
    for i in range(len(t)):
        print(f'{t[i]} | {vus[i]} | {rps[i]:.0f} | {lat[i]:.1f} | {err[i]:.2f}')

    first_err = next((i for i in range(len(t)) if err[i] > 1), None)
    first_slow = next((i for i in range(len(t)) if lat[i] > 50), None)
    if first_slow is not None:
        print(f'\nдеградация (auth p95 > 50ms): t={t[first_slow]}s, VU={vus[first_slow]}, RPS={rps[first_slow]:.0f}')
    if first_err is not None:
        print(f'отказ (ошибок > 1%): t={t[first_err]}s, VU={vus[first_err]}, RPS={rps[first_err]:.0f}')

    fig, ax = plt.subplots(3, 1, figsize=(9, 8), sharex=True)
    ax[0].plot(t, vus, color='tab:blue'); ax[0].set_ylabel('VU')
    ax[0].plot([], [])
    ax0b = ax[0].twinx(); ax0b.plot(t, rps, color='tab:gray', alpha=0.6); ax0b.set_ylabel('RPS')
    ax[1].plot(t, lat, color='tab:orange'); ax[1].set_ylabel('auth p95, мс')
    ax[2].plot(t, err, color='tab:red'); ax[2].set_ylabel('ошибки auth, %')
    ax[2].set_xlabel('время, с')
    for a in ax:
        a.grid(alpha=0.3)
        if first_slow is not None:
            a.axvline(t[first_slow], color='orange', ls='--')
        if first_err is not None:
            a.axvline(t[first_err], color='red', ls='--')
    fig.suptitle('Stress-test локального стенда')
    fig.tight_layout()
    fig.savefig('results/stress.png', dpi=120)


def soak(name):
    size = 60
    data = windows(f'results/{name}.csv', size, lambda r: r['url'].endswith('/api/auth'))
    t = [x[0] / 60 for x in data]
    lat = [p95(x[1]['dur']) for x in data]
    lat_avg = [avg(x[1]['dur']) for x in data]
    heap = [avg(x[1]['extra']['server_heap_mb']) for x in data]
    rss = [avg(x[1]['extra']['server_rss_mb']) for x in data]
    sess = [avg(x[1]['extra']['server_sessions']) for x in data]
    err = [100 * x[1]['err'] / x[1]['n'] if x[1]['n'] else 0 for x in data]

    print('мин | auth avg, ms | auth p95, ms | heap, MB | rss, MB | сессий | ошибки, %')
    for i in range(len(t)):
        print(f'{t[i]:.0f} | {lat_avg[i]:.1f} | {lat[i]:.1f} | {heap[i]:.0f} | {rss[i]:.0f} | {sess[i]:.0f} | {err[i]:.2f}')

    fig, ax = plt.subplots(2, 1, figsize=(9, 6), sharex=True)
    ax[0].plot(t, heap, label='heapUsed'); ax[0].plot(t, rss, label='rss')
    ax[0].set_ylabel('память сервера, МБ'); ax[0].legend()
    ax[1].plot(t, lat_avg, label='avg'); ax[1].plot(t, lat, label='p95')
    ax[1].set_ylabel('auth latency, мс'); ax[1].set_xlabel('время, мин'); ax[1].legend()
    for a in ax:
        a.grid(alpha=0.3)
    fig.suptitle(f'Soak-test: {name}')
    fig.tight_layout()
    fig.savefig(f'results/{name}.png', dpi=120)


if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'latency':
        latency()
    elif mode == 'stress':
        stress()
    else:
        soak(mode)
