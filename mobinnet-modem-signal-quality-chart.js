// ==UserScript==
// @name         Link Quality chart and more refresh for MobinNet Modem
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Draw chart for Link quality index of MobinNet TD-LTE/WiMax modems
// @author       Sadeq
// @icon         https://ir.sny.ir/favicon.ico
// @homepage     https://sadeq.ir/
// @match        http://*/status.asp
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.6.0/Chart.bundle.min.js
// ==/UserScript==

// Chart use ChartJS from https://github.com/chartjs/Chart.js
// more infor at http://www.chartjs.org/

const RefreshInterval=300;
const MaxChartPoint  = 100;
(
    function() {
        //    'use strict';

        if (window.zx) {
            clearInterval(window.zx);
        }
        // Check if there is any getGeneralInfo function
        if (GetGeneralInfo !== undefined) {
            window.zx=setInterval( function(){
                // Maybe later updates need more function call
                GetChartInfo();
            },RefreshInterval);
        }
    })();

function GetChartInfo()
{
    if (! document.getElementById('sqchart').isrunning )
        return;
    $.post("/goform/getGeneralInfo", "na", function(res){
        d=new Date();
        // addData(myChart,d.getHours()+':'+d.getMinutes()+':'+d.getSeconds(),(res.sinr-1)/100,(-res.rsrp/100)/5);
        addData(myChart,d.getMinutes()+':'+d.getSeconds(),(res.sinr-1)/100,(-res.rsrp/100)/5);
        deleteData(myChart);
        refreshStatus(res);
        myChart.update();
    });
}

// Post and retrun array of info
// http://192.168.9.1/goform/getGeneralInfo
//
var ctx = document.createElement('canvas');
ctx.isrunning = true;
ctx.height = "75";
//ctx.width = "500";
ctx.id = 'sqchart';
var AddtoElement='div_link_quality';
//var AddtoElement='statusSysInfo';

//document.body.appendChild(canv); // adds the canvas to the body element
document.getElementById(AddtoElement).appendChild(ctx); // adds the canvas to #someBox

ctx=document.getElementById('sqchart');
var myChart = new Chart(ctx, {
    type: 'line',
    data:{
        datasets: [
            {
                label:'Link Quality - 20 and up means perfect, 10 and less means poor',
                pointRadius : 0,
                data:[ ],
                backgroundColor: [ 'rgba(255, 99, 132, 0.1)' ],
                borderColor: [ 'rgba(255,99,132,1)' ],
                borderWidth: 1
            },
            {
                label:'',
                data:[],
                pointRadius : 0,
                backgroundColor: [ 'rgba(255,0,0,0.2)' ],
                borderColor: [ 'rgba(255,50,0,0.2)' ],
                borderWidth: 0,
            },
            {
                //label:'Signal strength lower in chart means better',
                label:'',
                pointRadius : 0,
                data:[],
                backgroundColor: [
                    'rgba(0, 255, 86, 0.2)'],
                borderColor: ['rgba(0, 205, 86, 0.3)'],
                borderWidth: 1
            },
        ],
        labels:[],
    },
    options: {
        animation: {
            //            duration:RefreshInterval,
            duration:0,
            //            easing: 'linear',
            easing : 'easeInOutExpo',
        },
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 5,
                    suggestedMax: 30,
                    Min:5,
                    Max:30,
                }
            }]
        }
    }
}
                       );
GetChartInfo();

function addData(chart, label, data,signal) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);
    chart.data.datasets[1].data.push(10);
    //chart.data.datasets[2].data.push(signal);
    //    chart.data.datasets.forEach((dataset) => {
    //        dataset.data.push(data);
    //    });
}
function deleteData(chart) {
    if (chart.data.labels.length<MaxChartPoint) return;
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Border Colors
// 'rgba(54, 162, 235, 0.2)',
// 'rgba(255, 206, 86, 0.2)',
// 'rgba(75, 192, 192, 0.2)',
// 'rgba(153, 102, 255, 0.2)',
// 'rgba(255, 159, 64, 0.2)'

// Background Colors
// 'rgba(255, 99, 132, 0.2)',
// 'rgba(54, 162, 235, 0.2)',
// 'rgba(255, 206, 86, 0.2)',
// 'rgba(75, 192, 192, 0.2)',
// 'rgba(153, 102, 255, 0.2)',
// 'rgba(255, 159, 64, 0.2)'
