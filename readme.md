    const l = [1, 2, {foo: [{bar: 3}]}]
    const pl = addPaths(l)

    console.log(`${pl[0]},${pl[1]},${pl[2].foo[0].bar}`)