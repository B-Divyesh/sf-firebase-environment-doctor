# Demo sandbox

The browser demo is at `/demo/?demo=1`. It opens with the bundled wrong-project
result, displays the persistent **Demo — sample data, nothing is saved** banner,
and has **Reset demo** and **Start for real** controls. Its only browser storage
key is `demo:firebase-environment-doctor:reset`; Reset and Start for real remove
that key. It never reads or writes the visitor's project data.

The CLI path is:

```sh
firebase-environment-doctor --demo
```

It writes `examples/demo-wrong-project` into a newly named directory under the
system temporary directory, runs the ordinary local diagnostic path with the
sample production override, and prints that directory. The fixture contains a
development default (`sample-store-dev`) and a selected production-like project
(`sample-store-prod`) so it produces a real project-context warning.
