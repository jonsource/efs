stack1 = new Stack();
stack1.Add(createUnit(0));
stack1.Add(createUnit(2));
stack1.Add(createUnit(0));
stack1.Add(createUnit(2));
stack1.Add(createUnit(1));
stack1.Add(createUnit(3));
stack1.Add(createUnit(4));
console.log(stack1);
stack2 = new Stack();
stack2.Add(createUnit(0));
stack2.Add(createUnit(0));
stack2.Add(createUnit(2));
stack2.Add(createUnit(2));
stack2.Add(createUnit(2));
stack2.Add(createUnit(3));
stack2.Add(createUnit(4));
console.log(stack2);

/* stack1 = spotter, stack2 = ambusher */

function resolveHalfSpotting(stack1, stack2, who)
{
    var spot = stack1.getSpotting();
    console.log(['spotting',spot]);
    stack2.ambush = false;
    for(var i=0; i<stack2.slots.length; i++)
    {   var r = rnd(6);
        console.log([r,spot,stack2.slots[i].unit.camo,r+spot-stack2.slots[i].unit.camo]);
        if(r+spot-stack2.slots[i].unit.camo < 3)
        {   stack2.slots[i].ambush = true;
            stack2.ambush = true;
        }
        else stack2.slots[i].ambush = false;
    }
    if(stack2.ambush)
    {   logEvent("hidden",null,null,who);
        for(var i=0; i<stack2.slots.length; i++)
        {   if(stack2.slots[i].ambush) 
            {   console.log(stack2.slots[i].unit);
                logEvent("ambush",stack2.slots[i].unit);
            }
        }
        
    }
}

function resolveSpotting(stack1,stack2) {
    resolveHalfSpotting(stack2,stack1,'Attacker');
    resolveHalfSpotting(stack1,stack2,'Defender');
}

function resolveHalfPhase(phase,stack1,stack2)
{   console.log(phase);
    var tgt;
    for(var i=0;i<stack1.slots.length;i++)
    {   if(stack1.slots[i].routed) continue;
        if(stack1.slots[i].unit.hp < 1) continue;
        if(phase=="indirect")
        {   /* pick random target for each attack */
            for(var at=0; at<getAttacks(phase); at++)
            {   tgt = stack2.getTarget(phase,stack1.slots[i].unit);
                if(!tgt) break;
                if(!phaseIs)
                {   phaseIs=true;
                    logEvent("phase",null,null,phase);
                }
                resolveAttack(phase,stack1.slots[i].unit,tgt);
            }
        }
        else
        {   var attacks = getAttacks(phase);
            tgt = stack2.getTarget(phase,stack1.slots[i].unit);
            while(attacks > 0)
            {   if(!tgt) break;
                if(!phaseIs)
                {   phaseIs=true;
                    logEvent("phase",null,null,phase);
                }
                resolveAttack(phase,stack1.slots[i].unit,tgt);
                attacks--;
                if(tgt.hp-tgt.slot.damage < 1) tgt = stack2.getTarget(phase,stack1.slots[i].unit);
            }
        }
    }
}

var phaseIs;

function resolvePhase(phase,stack1,stack2)
{   phaseIs = false;
    resolveHalfPhase(phase,stack1,stack2);
    resolveHalfPhase(phase,stack2,stack1);
    stack1.applyDamage();
    resolveRouting(stack1);
    stack1.clearDamage();
    stack2.applyDamage();
    resolveRouting(stack2);
    stack2.clearDamage();
}

function resolveRouting(stack) {
    i=0;
    console.log('routing');
    for (var i = 0; i < stack.slots.length; i++) 
    {   if(stack.slots[i].dead) continue;
        var mal;
        if(stack.slots[i].damage>10) mal=10;
        if(stack.slots[i].damage>50) mal=20;
        if(stack.slots[i].damage>90) mal=30;
        if(stack.slots[i].unit.hp<80) mal+=10;
        if(stack.slots[i].unit.hp<50) mal+=30;
        if(stack.slots[i].unit.hp<30) mal+=50;
        if(stack.slots[i].unit.morale-mal<rnd(100))
        {   console.log([i,mal,stack.slots[i].unit]);
            logEvent('routed',stack.slots[i].unit,null,null);
            stack.slots[i].routed = true;
        }
    }
}

function resolveAttack(phase,attacker,defender)
{   var dmg = 0;
    var att = attacker.attacks[phase][0];
    if(attacker.slot.ambush && phase!="indirect") att+=2;
    var agi = defender.agility;
    if(defender.slot.ambush) 
    {   agi+=4;
        if(phase=="indirect") agi+=4; 
    }
    var mod = att - agi
    r = rnd(20);
    
    if( r + mod >= 10)
    {   var armour = defender.armour * defender.hp / 100;
        var attack = attacker.attacks[phase][1] * attacker.hp / 100;
        dmg = getDamage(attack,armour);
        if(defender.slot.damage) defender.slot.damage+=dmg; 
        else defender.slot.damage = dmg;
        logEvent("damage",attacker,defender,defender.hp-defender.slot.damage);
        if(defender.hp-defender.slot.damage<1)
        {   logEvent("death",defender);   }
    }
    console.log([{id:attacker.id,name:attacker.name,attack:att,ambush:attacker.slot.ambush},{id:defender.id,name:defender.name,agility:agi,ambush:defender.slot.ambush},r,dmg]);
}

function checkRandom() {
    sl={};
    for(i=0;i<1000;i++)
    {   r = rnd(10);
        if( sl[r]) sl[r]++;
        else sl[r]=1;
    }
    console.log(sl);
}

events=[];

function logEvent(type,unit1,unit2,param) {
    if(type=="damage" && param < 0) param = 0;
    events.push({type:type,unit1:unit1,unit2:unit2,param:param});
}

resolveSpotting(stack1,stack2);

for(var i=0;i<stack1.slots.length;i++)
{   UIcreateUnit(stack1.slots[i].unit,"attacker");
}
for(var i=0;i<stack1.slots.length;i++)
{   UIcreateUnit(stack2.slots[i].unit,"defender");
}

for(ph=0; ph < Phases.length; ph++)
{   resolvePhase(Phases[ph],stack1,stack2);
}

logEvent('phase',null,null,'end');
//stack1.removeCasualties();
//stack2.removeCasualties();
console.log(events);

function UIcreateUnit(unit,stack) {
    var ambush='';
    if(unit.slot.ambush)
    {   ambush = ' ambush';
        console.log(unit.slot);
    }
    
    var un = $('<div class="unit id'+unit.id+''+ambush+'">'+unit.name+'<div class="bar"><div class="health" data-val="'+unit.hp+'" style="width:'+unit.hp+'%"></div><div class="curr-health" data-val="'+unit.hp+'" style="width:'+unit.hp+'%"></div></div></div>');
    $("#"+stack+"Units").append(un);
}

function nextStep()
{   step++;
    console.log(events[step]);
    if(step>=events.length) return;
    setTimeout(nextStep,500);
    if(events[step].type=="hidden")
    {   alert(events[step].param+' has hidden units!');   
    }
    if(events[step].type=="phase")
    {   var $tgt = $('.health');
        $.each($tgt, function(i,h) {
            $(h).css({width:$(h).data('val')});
        });
        alert(events[step].param+" phase");   
    }
    if(events[step].type=="ambush")
    {   $tgt = $('.unit.id'+events[step].unit1.id);
        $tgt.removeClass('ambush');
    }
    if(events[step].type=="damage")
    {   var $att = $('.unit.id'+events[step].unit1.id);
        $att.addClass('shooting');
        setTimeout(function() {$att.removeClass('shooting');},200);
        
        var $tgt = $('.unit.id'+events[step].unit2.id);
        $tgt.find('.curr-health').css({width:events[step].param+'%'});
        $tgt.find('.health').data('val',events[step].param);
        setTimeout(function() {$tgt.addClass('damaged');},150);
        setTimeout(function() {$tgt.removeClass('damaged');},400);
        
    }
    if(events[step].type=="death")
    {   var $tgt = $('.unit.id'+events[step].unit1.id);
        $tgt.addClass('dead');
    }
    if(events[step].type=="routed")
    {   var $tgt = $('.unit.id'+events[step].unit1.id);
        $tgt.addClass('routed');
    }
}

var step = -1;
setTimeout(nextStep,500);