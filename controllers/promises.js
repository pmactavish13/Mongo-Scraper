
var p1 = new Promise(function(resolve, reject) {
    setTimeout(() => {
        reject([1,2,3,4,5])
    }, 5000)
})

console.log('hello')


p1 
    .then ((resolvedValue) => {
        console.log(resolvedValue, 'resolved')
    })
    .catch((rejectedValue) => {
        console.log(rejectedValue, 'rejected')
    })


function makePromise(timeout=2000, condition=true) {
    var value = Math.floor(Math.random() * 1000)
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            if (condition) {
                resolve(value)
            } else {
                reject(new Error('There was an error'))
            }


        }, timeout)
    })

}



makePromise(1000, false)
    .then((resolvedValue) => {
        console.log(resolvedValue, 'This has resolved')
    })
    .catch((rejectedValue) => {
        console.log(rejectedValue, 'this has rejected')
    })


// Async await


async function resolveOurPromises () {
    var value1 = await makePromise()
    console.log(value1, 'value1')
}

resolveOurPromises()