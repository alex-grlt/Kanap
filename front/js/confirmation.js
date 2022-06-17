async function getOrderID(){
var str = window.location.href;
var url = new URL(str);
var name = url.searchParams.get("data");

orderId.innerHTML = "</br></br>" + name
}