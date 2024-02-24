const m = Process.enumerateModules()[0];
send(m)

rpc.exports = {
    forTest(i) {
        send({ value: i })
        return i*i
    }
}
