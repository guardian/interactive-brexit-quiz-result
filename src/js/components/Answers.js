import {
    select,
    selectAll
}
from 'd3-selection';

import {
    scaleLinear,
    scaleQuantize
}
from 'd3-scale';
import {
    format
}
from 'd3-format';
import {
    range
}
from 'd3-array';


export default function Answers(data,options) {

	console.log(data,options);
//var clrScale = { name: 'newsSupport2', selected: '#c5ffff', scale: ['#000026','#00284e','#00507b','#197caa','#5babdc','#90ddff','#c5ffff'] };
    let scale=scaleLinear().range([0,100]).domain([-0.5,0.5]),
        scaleWidth=scaleLinear().range([0,100]).domain([0,0.5]),
        colorScaleOver=scaleQuantize().range((['#00507b','#197caa','#5babdc','#90ddff','#c5ffff']).reverse()).domain([0,0.4]),
        colorScaleUnder=scaleQuantize().range((['#9c0000','#d61d00','#ff5b32','#ff8f5f','#ffc38e']).reverse()).domain([0,0.4]);

    let answers=select(options.container)
                    .append("div")
                    .attr("id","answers")

    let answer=answers.selectAll("div.answer")
            .data(data)
            .enter()
                .append("div")
                .attr("class","answer");

    // answer.append("h3")
    //         .html((d,i)=>(`<span>${i+1}</span>${d.question}`))

    answer.append("h2")
            .classed("over",d=>d.perc.diff>0)
            .classed("under",d=>d.perc.diff<0)
            .html((d,i)=>{
                let n=(Math.floor(Math.abs(d.perc.diff)*100)),
                    char=d.perc.diff>0?"o":"u",
                    word=d.perc.diff>0?"ver":"nder"
                console.log(i,n,d.perc.diff*100)
                let letters=range(n).map(v=>char).join('');

                return "<span class=\"num\">"+(i+1)+"</span> <span class=\"question\">"+d.question+"</span><br/>The question was <b>"+char+letters+"</b><i>"+word+"estimated</i> by "+format(",.2")(Math.abs(d.perc.diff)*100)+" percentage points.";
            })
            .select("b")
                .style("background-color",d=>{
                    if(d.perc.diff<0) {
                        return colorScaleUnder(Math.abs(d.perc.diff))    
                    }
                    return colorScaleOver(Math.abs(d.perc.diff))
                })



    return;
    let line=answer.append("div")
            .attr("class","line-container")

    line.append("span")
            .attr("class","line")
            .style("left",d=>{
                if(d.perc.diff<0) {
                    return scale(d.perc.diff)+"%"
                }
                return scale(0)+"%";
            })
            .style("width",d=>{
                return (Math.abs(scale(d.perc.diff)-50)+0.01)+"%"
            })


    line.append("span")
            .attr("class","zero")
            .style("left",d=>{
                return scale(0)+"%"
            })

    line.append("span")
            .attr("class","avg")
            .style("left",d=>{
                return scale(d.perc.diff)+"%"
            })

    line.append("span")
            .attr("class","zero")
            .style("left",d=>{
                return scale(0)+"%"
            })

    line.append("p")
            .classed("right",d=>d.perc.diff<0)
            .classed("left",d=>d.perc.diff>=0)
            .style("left",d=>{
                if(d.perc.diff<0) {
                    return 0;
                }
                return scale(d.perc.diff)+"%"
            })
            .style("width",d=>{
                if(d.perc.diff<0) {
                    return scale(d.perc.diff)+"%"
                }
                return "100%";
            })
            .text(d=>{
                return format("+,.2%")(d.perc.diff);
            })

}