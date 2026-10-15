"""Сравнение вариантов A и B: среднее, стандартное отклонение, t-тест Уэлча.

То же в Google Sheets:
  среднее            =AVERAGE(C2:C11)
  стандартное откл.  =STDEV(C2:C11)
  p-value (t-тест)   =T.TEST(C2:C11; C12:C21; 2; 3)   # 2 хвоста, тип 3 — неравные дисперсии

Запуск: python3 ab_test.py ab-results.csv
"""
import csv
import math
import sys

METRICS = [
    ('cta_click', 'Клик по CTA (доля)'),
    ('scroll_depth', 'Глубина скролла, %'),
    ('sus', 'SUS'),
    ('time_to_click_s', 'Время до клика, с'),
]


def mean(xs):
    return sum(xs) / len(xs)


def stdev(xs):
    m = mean(xs)
    return math.sqrt(sum((x - m) ** 2 for x in xs) / (len(xs) - 1))


def betacf(a, b, x):
    # цепная дробь для неполной бета-функции (Numerical Recipes)
    qab, qap, qam = a + b, a + 1, a - 1
    c, d = 1.0, 1 - qab * x / qap
    d = 1 / (d if abs(d) > 1e-30 else 1e-30)
    h = d
    for m in range(1, 200):
        m2 = 2 * m
        aa = m * (b - m) * x / ((qam + m2) * (a + m2))
        d = 1 + aa * d
        d = 1 / (d if abs(d) > 1e-30 else 1e-30)
        c = 1 + aa / c if abs(1 + aa / c) > 1e-30 else 1e-30
        h *= d * c
        aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2))
        d = 1 + aa * d
        d = 1 / (d if abs(d) > 1e-30 else 1e-30)
        c = 1 + aa / c if abs(1 + aa / c) > 1e-30 else 1e-30
        de = d * c
        h *= de
        if abs(de - 1) < 3e-12:
            break
    return h


def betai(a, b, x):
    if x <= 0:
        return 0.0
    if x >= 1:
        return 1.0
    lbt = math.lgamma(a + b) - math.lgamma(a) - math.lgamma(b) + a * math.log(x) + b * math.log(1 - x)
    if x < (a + 1) / (a + b + 2):
        return math.exp(lbt) * betacf(a, b, x) / a
    return 1 - math.exp(lbt) * betacf(b, a, 1 - x) / b


def welch(a, b):
    va, vb = stdev(a) ** 2 / len(a), stdev(b) ** 2 / len(b)
    if va + vb == 0:
        return 0.0, float('inf'), 1.0
    t = (mean(b) - mean(a)) / math.sqrt(va + vb)
    df = (va + vb) ** 2 / (va ** 2 / (len(a) - 1) + vb ** 2 / (len(b) - 1))
    p = betai(df / 2, 0.5, df / (df + t * t))  # двусторонний p-value
    return t, df, p


def main(path):
    rows = list(csv.DictReader(open(path, newline='', encoding='utf-8')))
    for key, title in METRICS:
        a = [float(r[key]) for r in rows if r['variant'] == 'A' and r[key].strip()]
        b = [float(r[key]) for r in rows if r['variant'] == 'B' and r[key].strip()]
        if len(a) < 2 or len(b) < 2:
            print(f'{title}: мало данных (A={len(a)}, B={len(b)})')
            continue
        t, df, p = welch(a, b)
        verdict = 'различие значимо (p < 0.05)' if p < 0.05 else 'различие незначимо'
        print(f'{title}: A = {mean(a):.2f} ± {stdev(a):.2f}, B = {mean(b):.2f} ± {stdev(b):.2f}, '
              f't = {t:.2f}, df = {df:.1f}, p = {p:.3f} — {verdict}')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'ab-results.csv')
