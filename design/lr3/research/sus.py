"""Расчёт SUS по методичке.

Нечётные вопросы (1, 3, 5, 7, 9): ответ − 1
Чётные вопросы (2, 4, 6, 8, 10): 5 − ответ
Сумма × 2.5

Запуск: python3 sus.py sus.csv
"""
import csv
import sys


def grade(score):
    if score >= 80:
        return 'Отлично'
    if score >= 68:
        return 'Хорошо'
    if score >= 50:
        return 'Удовлетворительно'
    return 'Плохо'


def sus(answers):
    total = 0
    for i, a in enumerate(answers, start=1):
        total += (a - 1) if i % 2 == 1 else (5 - a)
    return total * 2.5


def main(path):
    scores = []
    with open(path, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            answers = [row[f'q{i}'].strip() for i in range(1, 11)]
            if not all(answers):
                print(f"участник {row['participant']}: не все ответы заполнены, пропущен")
                continue
            answers = [int(a) for a in answers]
            if any(a < 1 or a > 5 for a in answers):
                raise ValueError(f"участник {row['participant']}: ответы должны быть 1–5")
            s = sus(answers)
            scores.append(s)
            print(f"участник {row['participant']}: SUS = {s:.1f} ({grade(s)})")
    if not scores:
        print('нет заполненных строк')
        return
    mean = sum(scores) / len(scores)
    print(f'средний SUS = {mean:.1f} ({grade(mean)}), участников: {len(scores)}')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'sus.csv')
