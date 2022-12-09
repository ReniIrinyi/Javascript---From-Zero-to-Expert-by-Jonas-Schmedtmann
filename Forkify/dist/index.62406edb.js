const recipeContainer = document.querySelector(".recipe");
const timeout = function(s) {
    return new Promise(function(_, reject) {
        setTimeout(function() {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};
// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
function sumMix(x) {
    let num;
    typeof x === "Number" || parseInt(x);
    // parseInt(x).reduce((acc, curr) => acc + curr, 0);
    console.log(num);
}
sumMix([
    1,
    2,
    "1"
]);

//# sourceMappingURL=index.62406edb.js.map
