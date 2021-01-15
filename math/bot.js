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

function getInside(expression,fname){
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
                        status=-1;
                        array.push(current);   
                   }
                }
            }
            return array;
}

function graph(fs,step){
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
            let colors=["#48f0e7","#af03ff","#e3004c","#3a9473","#6cb519","#fcbd74","#594226","#4d0f94","#c45a5a","#5917bd"];
            let letters="fghijklmnopqrstuvwxyzabcdeFGHIJKLMNOPQRSTUVWXYZABCDE";
            let color="#2375d9";
            t=t.setColor(color).setLineWidth(2).setStroke(color).beginPath();
            for(var n in fs){
                let f = fs[n];
                let name = 15+Math.ceil(Math.random()*25);
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
                            if((yr(fx1)>-200&&yr(fx1)<700)||(yr(fx2)>-200&&yr(fx2)<700)){
                                t=t.moveTo(xr(x1),yr(fx1)).bezierCurveTo(xr(xm),yr(fxm),xr(xm),yr(fxm),xr(x2),yr(fx2));
                            }
                            if(i===name){
                                let ddx=derivative(f);
                                let _x=0;
                                let _y=0;
                                if(ddx(x1)==0){
                                    _x=x1;
                                    _y=f(x1)-step/2;
                                } else {
                                    function line(t){
                                        let rate=-1/ddx(x1);
                                        return rate*(t-x1)+f(x1);
                                    }
                                    _x=x1+step/2;
                                    _y=f(_x);
                                }
                                t=t.printText(letters[n],xr(_x),yr(_y));
                            }
                      }catch(err){}
                }
                t=t.stroke();
                color = colors[Math.floor(Math.random()*colors.length)];
                t=t.setLineWidth(2).setStroke(color).setColor(color).beginPath();
            }
            t=t.stroke();
            return t;
}

function toEvalFunction(string){
        let ds=getInside(string,"ddx");
        for(var s in ds){
            string=string.replace("ddx("+ds[s]+")","derivative(a=>("+ds[s].split("x").join("a")+"))");
        }
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
        string = string.split("phi").join("((1+Math.sqrt(5))/2)");
        return string;
}

function getFunctionFromExp(exp){
                        let possible = ["ddx","phi",".",",","/","(",")","sqrt","cbrt","power","ln","log","*","+","-","arccos","arcsin","arctan","cos","sin","tan","pi","e","x","1","2","3","4","5","6","7","8","9","0"];
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
         
        if(args[0]=="graph"){
                if(!args[1]){
                        message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify a function."));
                } else {
                       let functions=[];
                        let step=5;
                       let emb=new Discord.MessageEmbed().setColor("BLUE");
                       let list=[];
                       for(var n in args){
                            if(n!==0){
                                let ar=args[n];
                                let mat=ar.match(/^step:(\d+(\.\d+)?$)/);
                                if(mat){
                                    step=parseFloat(mat[1]);
                                } else {
                                    let t=getFunctionFromExp(ar);
                                    if(typeof t === "string"){
                                        return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(t)); 
                                    }
                                    list.push(ar);
                                    functions.push(t);
                                }
                                
                            }
                       }
                       if(step<=0) step=5;
                       let letters="fghijklmnopqrstuvwxyzabcdeFGHIJKLMNOPQRSTUVWXYZABCDE";
                       emb.setDescription("**Graph of :** `"+list.map((t,i)=>letters[i]+"(x)="+t).join("` \n `")+"` \n**Step :** "+step);
                       await message.channel.send(emb);
                       await message.channel.send("",{files:[graph(functions,step).toBuffer()]});
                }
        } else if(args[0]=="howgraph"){
                    let embed=new Discord.MessageEmbed().setColor("GREEN").setDescription("**How to draw a graph:**\nUse the command: `"+prefix+"graph (function formula) (step)`");
                    embed.addField("Variable","Variable is named `x`.");
                    embed.addField("Symbols","Use `*` for mutiplication, `/` for division, `+` for addition and `-` for subtraction.");
                    embed.addField("Functions","You can use functions such as: `sqrt(x)`, `cbrt(x)`, `power(base,exponent)`, `tan(x)`...");
                    embed.addField("Constants","You can also use constants such as: `pi`, `e`, `phi`...");
                    embed.addField("Differentiation","To use the derivative of a function, please write your function like this: `ddx(f(x))(x)` where `f(a)` is the function. For example, `ddx(x*x)(x)` will show the curve of the derivative of `x*x`, which is `2x`.\n**Each derivative expression MUST be followed by (x) as it represent the input (it might also be replaced by any value), for instance, `ddx(x+2)(x)` is the derivative of `x+2`, while `ddx(ddx(x+2)(x))(x)` is the second derivative of `x+2`.");
                    message.channel.send(embed);
                    
        }
})

module.exports = client;
client.login("Nzk4MjAyMDkwMTIzMDM0NzE2.X_xloA.VwZRJiPbrutDP0Ru-qvPLC5ccrs");
