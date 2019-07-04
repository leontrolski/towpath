function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]'
}
function isPlainObject(o) {
    if (!isObject(o)) return false
    if (typeof o.constructor !== 'function') return false
    if (!isObject(o.constructor.prototype)) return false
    if (!o.constructor.prototype.hasOwnProperty('isPrototypeOf')) return false
    return true;
}

const _pathSymbol = Symbol('path')
const _valueSymbol = Symbol('value')

export default function addPaths(value, path=[]){
    const handler = {
        get: (v, k)=>{
            if (k === _pathSymbol) return v.path
            if (k === _valueSymbol) return v.value
            const got = v.value[k]
            // if is a method, bind
            if (typeof got === 'function' && !isPlainObject(v.value)) return got.bind(v.value)
            return got
        },
        getPrototypeOf: (v)=>v.value.__proto__,
    }
    if (Array.isArray(value)) value = value.map((v, i)=>addPaths(v, [...path, i]))
    if (isPlainObject(value)) value = Object.entries(value)
        .map(([k, v])=>({[k]: addPaths(v, [...path, k])}))
        .reduce((a, b)=>({...a, ...b}), {})
    return new Proxy({value, path}, handler)
}
export default function path(proxy){
    return proxy[_pathSymbol]
}
export default function value(proxy){
    return proxy[_valueSymbol]
}
export default function set(obj, proxy, newValue){
    const path_ = path(proxy).slice(0, -1)
    const finalK = path(proxy).slice(-1)
    path_.reduce((a, b)=>a[b], obj)[finalK] = newValue
}
