export function loadSyllabus(){
  try{
    return require('./syllabus.json')
  }catch(e){
    return {}
  }
}
