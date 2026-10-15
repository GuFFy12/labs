#!/bin/sh
# Собирает css/bundle.css из модулей (порядок важен: шрифты, токены, ..., страницы)
cd "$(dirname "$0")"
cat css/fonts.css css/tokens.css css/base.css css/layout.css css/components.css css/pages.css > css/bundle.css
echo "css/bundle.css: $(wc -c < css/bundle.css) bytes"
