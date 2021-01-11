const Discord = require('discord.js');
const Canvas = require('canvas-constructor');
const client = new Discord.Client();
const prefix = "x";

let derivative = function(f){return function(x){return (f(x)-f(x-0.000001))/0.000001}}

function graph(f,step){
            let t=new Canvas.Canvas(500,500);
            t=t.setColor("WHITE").printRectangle(0,0,500,500).setColor("BLACK").printRectangle(249,0,2,500).printRectangle(0,249,500,2);
            for(var i=0; i<50; i++){
            t=t.setColor("LIGHTGRAY");
            if(i%5==0){
            t=t.printRectangle(i*10,0,2,500);
            t=t.printRectangle(0,i*10,500,2);
            }
            t=t.setColor("BLACK");
            t=t.printRectangle(247,i*10,6,2);
            if(i%5==0) t.printText((25-i)*step/5,255,i*10+5)
            t=t.printRectangle(i*10,247,2,6);
            if(i%5==0) t.printText((i-25)*step/5,i*10-5,255+8)
            }
            t=t.setColor("#ff5d05").beginPath();
            for(var i=0; i<50; i++){
                try{
                if(f(i-25)<150&&f(i-25)>-150){
                        t=t.moveTo(250+(i-25)*10,250-10*f((i-25)*(step/5))).bezierCurveTo(250+10*(i-25+1/2),250-10*f((i-25+1/2)*step/5),250+10*(i-25+1/2),250-10*f((i-25+1/2)*step/5),250+10*(i-24),250-10*f((i-24)*step/5));
                }
                }catch(err){}
            }
            t=t.stroke();
            return t.toBuffer();
}

function toEvalFunction(string){
        string = string.split("power").join("Math.pow");
        string = string.split("sqrt").join("Math.sqrt");
        string = string.split("cbrt").join("Math.cbrt");
        string = string.split("log").join("Math.log10");
        string = string.split("ln").join("Math.log");
        string = string.split("e").join("(Math.E)");
        string = string.split("pi").join("(Math.pi)");
        return string;
}

client.on("message",async(message)=>{
        var args=message.content.toLowerCase().split(" ");
        if (!args[0].startsWith("x")) return;
        args[0] = args[0].substring(1);
         
        if(args[0]=="graph"){
                if(!args[1]){
                        message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Please specify a function."));
                } else {
                       let possible = [",","/","(",")","sqrt","cbrt","power","ln","log","*","+","-","cos","sin","tan","pi","e","x","1","2","3","4","5","6","7","8","9","0"];
                       let s = args[1];
                       for(var t in possible){
                               s = s.split(possible[t]).join("");
                       }
                       if(s!==""){
                                return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("You're using illegal characters, please check your function again."));
                       }
                       try{
                                eval("let f=function(x){ return ("+toEvalFunction(args[1])+");}");      
                       }catch(err){
                                return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription("Syntax error. Please check your function again."));      
                       }
                       let step=5;
                       if(parseInt(args[2])) step=parseInt(args[2]);
                       if(step===0) step=5;
                       eval("function f(x){ return ("+toEvalFunction(args[1])+");}");
                       message.channel.send("**Here's your graph:**",{files:[graph(f,step)]});
                }
        }
})

module.exports = client;
client.login("Nzk4MjAyMDkwMTIzMDM0NzE2.X_xloA.VwZRJiPbrutDP0Ru-qvPLC5ccrs");
