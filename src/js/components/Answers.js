import {
    select,
    selectAll
}
from 'd3-selection';
import {
    format
}
from 'd3-format';
import {
    range
}
from 'd3-array';


export default function Answers(data,options) {

	//console.log(data,options);
//var clrScale = { name: 'newsSupport2', selected: '#c5ffff', scale: ['#000026','#00284e','#00507b','#197caa','#5babdc','#90ddff','#c5ffff'] };
    // let scale=scaleLinear().range([0,100]).domain([-0.5,0.5]),
    //     scaleWidth=scaleLinear().range([0,100]).domain([0,0.5]),
    //     colorScaleOver=scaleQuantize().range((['#00507b','#197caa','#5babdc','#90ddff','#c5ffff']).reverse()).domain([0,0.4]),
    //     colorScaleUnder=scaleQuantize().range((['#9c0000','#d61d00','#ff5b32','#ff8f5f','#ffc38e']).reverse()).domain([0,0.4]);

    let answers=select(options.container)
                    .append("div")
                    .attr("class","answers")

    answers.append("h1")
                .html(options.title)

    let answer=answers.selectAll("div.answer")
            .data(data)
            .enter()
                .append("div")
                .attr("class","answer");

    // answer.append("h3")
    //         .html((d,i)=>(`<span>${i+1}</span>${d.question}`))

    // let MEAN=mean(data,d=>{
    //     return Math.abs(d.perc.diff)
    // });
    // console.log("MEAN",MEAN)

    answer.append("h2")
            .classed("over",d=>d.perc.diff>0)
            .classed("under",d=>d.perc.diff<0)
            .html((d,i)=>{
                let abs=Math.abs(d.perc.diff),
                    n=(Math.ceil(abs*100)),
                    char="a",//d.perc.diff>0?"&nbsp;":"&nbsp;",
                    word=d.perc.diff>0?"&nbsp;over":"&nbsp;under"
                //console.log(i,n,d.perc.diff*100)
                
                let pp=" "+"by "+format(",.2")(abs*100)+" percentage points.";

                let letters=range(n-5).map(v=>"<b>"+char+"</b>").join('');


                letters="<b>w</b>"+letters+"<b>y</b><b>&nbsp;</b><b>o</b><b>f</b><b>f</b>";
                word=","
                if(d.npp) {
                    word=".";
                }

                if(abs<=0.05) {
                    letters="<b>o</b><b>f</b><b>f</b><b>&nbsp;</b><b>&nbsp;</b>";
                    word=" ";
                }

                if(abs<=0.04) {
                    letters="<b>o</b><b>f</b><b>f</b>&nbsp;";
                    word=" ";
                }

                if(abs<=0.03) {
                    letters="<b>o</b><b>f</b><b>f</b>";
                    word=" the money.";
                    pp="";
                }
                
                if(abs<=0.02) {
                    letters="<b>i</b><b>n</b>";
                    word=" the ballpark.";
                }
                if(abs<=0.01) {
                    letters="<b>i</b>";
                    word="n the ballpark.";
                }

                //word+=" "+Math.abs(d.perc.diff);

                

                if(d.npp) {
                    pp="";
                    //word="";
                }

                let figures=`The actual answer is ${getNumber(d.answer,d.symbol)}. The average response from people taking the quiz was ${getNumber(d.avg,d.symbol)}.`;


                return "<span class=\"question\">"+d.question+"</span><span class=\"the-readers\">The readers were </span><b>"+letters+"</b>"+word+pp+" "+(figures || "");
                //WITH QUESTION NUMBER
                return "<span class=\"question\"><span class=\"num\">"+(i+1)+".</span> "+d.question+"</span><span class=\"the-readers\">The readers were </span><b>"+letters+"</b>"+word+pp+" "+(figures || "");
            })
            



    function getNumber(value,symbol) {
        //console.log(value,symbol)
        if(symbol==="%") {
            return format(",.0%")((value/100));
        }
        return format(",.0d")(value);
    }

}