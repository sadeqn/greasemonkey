// ==UserScript==
// @name         Link Quality chart and more refresh for MobinNet Modem
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  draw a chart of Link quality index for MobinNet TD-LTE/WiMax modems
// @author       Sadeq
// @icon         https://ir.sny.ir/favicon.ico
// @homepage     https://sadeq.ir/
// @match        http://*/status.asp
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.6.0/Chart.bundle.min.js
// //@updateURL  https://ir.sny.ir:3000/sadeq/greasemonkey-scripts/raw/master/chart4mobinnet.user.js
// ==/UserScript==

// Chart use ChartJS from https://github.com/chartjs/Chart.js
// more infor at http://www.chartjs.org/

const RefreshInterval=500;
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
    $.post("/goform/getGeneralInfo", "na", function(res){
        d=new Date();
        addData(myChart,d.getHours()+':'+d.getMinutes()+':'+d.getSeconds(),(res.sinr-1)/100);
        deleteData(myChart);
        refreshStatus(res);
        myChart.update(0);
    });
}

// Post and retrun array of info
// http://192.168.9.1/goform/getGeneralInfo
//
var ctx = document.createElement('canvas');
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
        datasets: [{
            label:'Signal',
            pointRadius : 1,
            data:[
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }],
        labels:[
            '','','','','',
            '','','','','',
            '','','','','',
            '','','','','',
        ],
    },
    options: {
        animation: {
            duration:RefreshInterval,
//            easing: 'linear',
            easing : 'easeInOutExpo',
        },
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 20,
                    Min:0,
                    Max:20,
                }
            }]
        }
    }
}
                       );

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
}
function deleteData(chart) {
    if (chart.data.labels.length<30) return;
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
