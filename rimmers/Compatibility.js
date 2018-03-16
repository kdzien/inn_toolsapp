"use strict";

class Compatibility {
    constructor(make,model,platform,type,production_period,engine){
        this.make=make;
        this.model=model;
        this.platform=platform;
        this.type=type;
        this.production_period=production_period;
        this.engine=engine;
    }
    getFullName(){
        var temp_platform
        this.platform === "--" ? temp_platform='' : temp_platform=`(${this.platform})`;
        return `${this.model} ${temp_platform}`;
    }
    getEngineParameter(parametr){
        let index
        this.splitEngine().forEach((elem,i)=>{
            if(elem.indexOf(parametr)!==-1){
                index=i;
            }
        })
        if(index===undefined){
            return "null"
        }
        switch(parametr){
            case "ccm":
                return this.splitEngine()[index].replace(/\D/g,'').trim();
                break
            case "KW":
                return this.splitEngine()[index].replace(/\D/g,'').trim();
                break
            case "PS":
                return this.splitEngine()[index].replace(/\D/g,'').trim();
                break
            default:
                return 0;
        }
    }

    getYearFrom(){
        return this.production_period.split("-")[0].split("/")[0]
    }
    getYearTo(){
        return this.production_period.split("-")[1].split("/")[0]
    }
    getMonthFrom(){
        return this.production_period.split("-")[0].split("/")[1]
    }
    getMonthTo(){
        return this.production_period.split("-")[1].split("/")[1]
    }
    splitEngine(){
        return this.engine.split(",")
    }

    getInsertQuery(){
        return `'${this.make}','${this.getFullName()}','${this.type}','${this.getEngineParameter("PS")}','${this.getEngineParameter("KW")}','${this.getYearFrom()}','${this.getMonthFrom()}', '${this.getYearTo()}','${this.getMonthTo()}','${this.getEngineParameter("ccm")}'`
    }
}

module.exports = Compatibility