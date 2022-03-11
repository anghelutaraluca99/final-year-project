module.exports = (comp_result) => {

  let deconstruct_result = (result) => {

    // refined objects starts as the initial object; unnecessary and empty properties are removed from it.
    let refined_result = result;

    // get list of object properties(keys)
    let keys = Object.keys(result);


    // if result is an object with no keys (result === {}) , result becomes null (result === null)
    if(keys.length === 0)
      return null;

    // if result has keys
    for(let i = 0; i < keys.length; i++) {
      // For each property(key), check the following:
      let key = keys[i];
      console.log("------------Key checked: ", key);
      console.log("Response: ", JSON.stringify(refined_result, 0, 2));

      // if key contains an object (and not timestamp; timestamp is considered of type Object but does nto contain key value pairs)
      if(typeof result[key] === 'object' && key !== 'timestamp') {
        // Repeat function for the 
        console.log("Loop object - Modifying ", key);
        console.log("typeof result[key]", typeof result[key]);
        refined_result[key] = deconstruct_result(result[key]);
      } 
        // if key is duration; disconsider
      if(key === 'duration') {
        console.log("Loop duration - Deleting ", key);
        delete refined_result[key];
      }

        // if property is null; disconsider
      if(refined_result[key] === null){
        console.log("Loop null - Deleting ", key);
        delete refined_result[key];
      }

        // if result is an object with no keys (result === {}) , result becomes null (result === null)
      if(Object.keys(refined_result).length === 0){
        console.log("Loop length 0 - Deleting ", key);
        return null;
      }
    }
    return refined_result;
  }

  return deconstruct_result(comp_result);
}