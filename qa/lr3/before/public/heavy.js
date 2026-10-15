// имитация тяжёлых сторонних скриптов: блокируем главный поток ~1.5с
var start = Date.now();
var junk = [];
while (Date.now() - start < 1500) {
    junk.push(Math.random().toString(36));
    if (junk.length > 10000) junk = [];
}
