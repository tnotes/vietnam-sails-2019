module.exports = async function(keyword,list){

    return list.filter(({name})=>name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
};
