function minutesToHours(minutes){
	var hours = Math.floor(minutes / 60);
	var remainder = minutes % 60;
  if(remainder===0) return hours + " hrs"
  if(hours===0) return remainder + " min"
	if(remainder < 10){
		remainder += '0' 
	}
	return hours + ":" + remainder
}

function moneyConversion(dollars){
  if(dollars===0) return "Free"
  else return "$" + dollars;
}

//module.exports.mth = minutesToHours;
