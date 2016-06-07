import {
    json
} from 'd3-request'

import mainHTML from './text/main.html!text'
import data from '../assets/data/data.json!json'
import Answers from './components/Answers';



export function init(el, context, config, mediator) {
    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    
    let dataKey = "16hTJg_J1H1V_iT3bN5xTN1ZTQ0st4ybAYuZq8GAEobw";
    let dataSrc = "https://interactive.guim.co.uk/docsdata/" + dataKey + ".json";

    json(dataSrc, (json) => {
            let questions = json.sheets.questions.filter(d=>d.selection!=="");

            console.log(questions)

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

            new Answers(questions.sort((a,b)=>{
                //console.log(Math.abs(b.perc.diff) - Math.abs(a.perc.diff))
                return Math.abs(b.perc.diff) - Math.abs(a.perc.diff)
            }),{
                container:el.querySelector(".interactive-container")
            })
            

        }
    );

    
    
}
