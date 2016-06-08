import iframeMessenger from 'guardian/iframe-messenger'
import {
    json
} from 'd3-request'

import mainHTML from './text/embed.html!text'
import data from '../assets/data/data.json!json'
import Answers from './components/Answers';

window.init = function init(el, config) {
    iframeMessenger.enableAutoResize();

    el.innerHTML = mainHTML;

    let dataKey = "16hTJg_J1H1V_iT3bN5xTN1ZTQ0st4ybAYuZq8GAEobw";
    let dataSrc = "https://interactive.guim.co.uk/docsdata/" + dataKey + ".json";

    json(dataSrc, (json) => {
            let questions = json.sheets.questions.filter(d=>d.selection!=="");

            //console.log(questions)

            questions.forEach((q,i)=>{
                let p=(data[i].avg - q.min)/(q.max-q.min),
                    r=(data[i].r - q.min)/(q.max-q.min);
                //console.log(p,r,data[i].r)

                q.avg=data[i].avg;
                q.perc={
                    reader:p,
                    real:r,
                    diff:p-r
                };
                q.comment=data[i].comment;
                q.npp=data[i].npp;

            })

            new Answers(questions.filter(d=>{
                return Math.abs(d.perc.diff)<=0.02
            }).sort((a,b)=>{
                //console.log(Math.abs(b.perc.diff) - Math.abs(a.perc.diff))
                return Math.abs(a.perc.diff) - Math.abs(b.perc.diff)
            }),{
                container:el.querySelector(".interactive-container"),
                title:"In the ballpark"
            })

            new Answers(questions.filter(d=>{
                return Math.abs(d.perc.diff)>0.02 && Math.abs(d.perc.diff)<=0.05
            }).sort((a,b)=>{
                //console.log(Math.abs(b.perc.diff) - Math.abs(a.perc.diff))
                return Math.abs(a.perc.diff) - Math.abs(b.perc.diff)
            }),{
                container:el.querySelector(".interactive-container"),
                title:"Off"
            })

            new Answers(questions.filter(d=>{
                return Math.abs(d.perc.diff)>0.05
            }).sort((a,b)=>{
                //console.log(Math.abs(b.perc.diff) - Math.abs(a.perc.diff))
                return Math.abs(a.perc.diff) - Math.abs(b.perc.diff)
            }),{
                container:el.querySelector(".interactive-container"),
                title:"Way off"
            })
            

        }
    );
    
};
