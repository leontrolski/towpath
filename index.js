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
function mapObj(obj, f){
    return Object.entries(obj)
        .map(([k, v])=>({[k]: f(k, v)}))
        .reduce((a, b)=>({...a, ...b}), {})
}

const _pathSymbol = Symbol('path')
const _valueSymbol = Symbol('value')

export function addPaths(value, path=[]){
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
    if (isPlainObject(value)) value = mapObj(value, (k, v)=>addPaths(v, [...path, k]))
    return new Proxy({value, path}, handler)
}
export function path(proxy){
    return proxy[_pathSymbol]
}
export function value(proxy){
    const value_ = proxy[_valueSymbol]
    if (Array.isArray(value_)) return value_.map(value)
    if (isPlainObject(value_)) return mapObj(value_, (k, v)=>value(v))
    return value_
}
export function set(obj, proxy, newValue){
    const path_ = path(proxy).slice(0, -1)
    const finalK = path(proxy).slice(-1)
    path_.reduce((a, b)=>a[b], obj)[finalK] = newValue
}
