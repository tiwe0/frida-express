const m = Process.enumerateModules()[0];
console.log(JSON.stringify(m));
send(JSON.stringify(m))