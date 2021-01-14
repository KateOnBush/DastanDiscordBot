const Discord = require('discord.js');
const Canvas = require('canvas-constructor');
const client = new Discord.Client();
const prefix = "x";

let derivative = function(f){
return function(x){
            let cl=0.000001;
            return (f(x+cl)-f(x-cl))/(2*cl);
            }
}

function getInsideOfFunction(expression,fname){
            let array = [];
            let current = "";
            let status=-1;
            for(var t in expression){
                let i = expression[t]
                if((i===fname[fname.length-1])&&(expression.slice(t+1-fname.length).startsWith(fname)&&status==-1)){
                   status=0;
                }
                if(status!==1){
                    current+=i;   
                }
                if(i=="("){
                   status++;   
                }
                if(i===")"){
                   status--;
                   if(status==0){
                        return current;   
                   }
                }
            }
}

function graph(f,step){
            let t=new Canvas.Canvas(500,500);
            t=t.setColor("#232126").printRectangle(0,0,500,500).setColor("#e4ddeb").printRectangle(249,0,2,500).printRectangle(0,249,500,2);
            for(var i=0; i<50; i++){
            t=t.setColor("#343138");
            if(i%5==0){
            t=t.printRectangle(i*10,0,2,500);
            t=t.printRectangle(0,i*10,500,2);
            } else {
            t=t.setColor("#2d2a30");
            t=t.printRectangle(i*10,0,1,500);
            t=t.printRectangle(0,i*10,500,1);              
            }
            t=t.setColor("#e4ddeb");
            t=t.printRectangle(247,i*10,6,2);
            if(i%5==0) t.printText((25-i)*step/5,255,i*10+5)
            t=t.printRectangle(i*10,247,2,6);
            if(i%5==0) t.printText((i-25)*step/5,i*10-5,255+8)
            }
            t=t.setLineWidth(2).setStroke("#2375d9").beginPath();
            for(var i=0; i<50; i+=1/4){
                try{
                        var x1=(i-25)*step/5;
                        var fx1=f(x1);
                        var x2=(i-25+1/4)*step/5;
                        var fx2=f(x2)
                        var xm=(x1+x2)/2;
                        var fxm=f(xm);
                        function xr(x){ return 250+x*(5/step)*10; }
                        function yr(y){ return 250-y*(5/step)*10; }
                        if(yr(fx1)>-200&&yr(fx1)<700&&yr(fx2)>-200&&yr(fx2)<700){
                            t=t.moveTo(xr(x1),yr(fx1)).bezierCurveTo(xr(xm),yr(fxm),xr(xm),yr(fxm),xr(x2),yr(fx2));
                        }
                  }catch(err){}
            }
            t=t.stroke();
            return t;
}

function toEvalFunction(string){
        string = string.split("ddx(").join("derivative(x=>");
        string = string.split("power").join("Math.pow");
        string = string.split("arccos").join("ARCCOS").split("cos").join("Math.cos").split("ARCCOS").join("Math.acos");
        string = string.split("arcsin").join("ARCSIN").split("sin").join("Math.sin").split("ARCSIN").join("Math.asin");
        string = string.split("arctan").join("ARCTAN").split("tan").join("Math.tan").split("ARCTAN").join("Math.atan");
        string = string.split("sqrt").join("Math.sqrt");
        string = string.split("cbrt").join("Math.cbrt");
        string = string.split("log").join("Math.log10");
        string = string.split("ln").join("Math.log");
        string = string.split("e").join("(Math.E)");
        string = string.split("pi").join("(Math.pi)");
        return string;
}

function getFunctionFromExp(exp){
                        let possible = [".",",","/","(",")","sqrt","cbrt","power","ln","log","*","+","-","arccos","arcsin","arctan","cos","sin","tan","pi","e","x","1","2","3","4","5","6","7","8","9","0"];
                       let s = exp;
                       for(var t in possible){
                               s = s.split(possible[t]).join("");
                       }
                       if(s!==""){
                                return "You're using illegal characters, please check your function again.";
                       }
                       try{
                                eval("let g=function(x){ return ("+toEvalFunction(exp)+");}");      
                       }catch(err){
                                return "Syntax error. Please check your function again.";      
                       }
                       return eval("(x)=>("+toEvalFunction(exp)+")");
}

client.on("message",async(message)=>{
        var args=message.content.toLowerCase().split(" ");
        if (!args[0].startsWith("x")) return;
        args[0] = args[0].substring(1);
         
        if(args[0]=="graph"||args[0]=="ddxgraph"||args[0]=="ddx2graph"){
                if(!args[1]){
                        message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify a function."));
                } else {
                       let f=getFunctionFromExp(args[1]);
                       if(typeof f === "string"){
                            return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(f)); 
                       }
                       let step=5;
                       if(parseFloat(args[2])) step=parseFloat(args[2]);
                       if(step<=0) step=5;
                       let emb=new Discord.MessageEmbed().setColor("BLUE").setTitle("`f(x)="+args[1]+"`");
                       let g=()=>{};
                       let type="";
                       if(args[0]=="ddxgraph"){
                               g=derivative(f);
                               type="Derivative";
                       } else if(args[0]=="ddx2graph"){
                               g=derivative(derivative(f));
                               type="Second Derivative";
                       } else {
                               g=f;
                               type="Function";
                       }
                       emb.setDescription("**Graph of :** "+type+".\n**Step :** "+step);
                       message.channel.send(emb);
                       message.channel.send("",{files:[graph(g,step).toBuffer()]});
                }
        }
})

module.exports = client;
client.login("Nzk4MjAyMDkwMTIzMDM0NzE2.X_xloA.VwZRJiPbrutDP0Ru-qvPLC5ccrs");
