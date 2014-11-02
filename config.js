AttackVsMovement = {
foot:		["indirect", "close"],
wheel:		["indirect", "direct", "rangesp"],
tread:		["indirect", "direct", "rangesp"],
air:		["air", "rangesp"],
naval:		["underwater", "indirect", "direct", "rangesp"],
space:		["rangesp", "directsp", "closesp"],
hover:		["indirect", "direct", "rangesp"],
jump:		["rangesp", "directsp", "closesp"],
crawler:	["indirect", "direct", "rangesp"],
lander:	    ["rangesp", "directsp", "closesp"],
}

NumberOfAttacks = { underwater:	4,
indirect:	2,
air:		2,
direct:		3,
close:		4,
psychic:	2,
rangesp:	2,
directsp:	3,
closesp:	4 };

DMG = [
[1,    1,    1,    5,    10,   15,   20,   25,   30,   40,   50,   60],
[2,    3,    5,    10,   15,   20,   25,   30,   40,   50,   60,   70],
[3,    5,    10,   15,   20,   25,   30,   40,   50,   60,   70,   80],
[5,    10,   15,   20,   25,   30,   40,   50,   60,   70,   80,   90],
[10,   15,   20,   25,   30,   40,   50,   60,   70,   80,   90,  100],
[15,   20,   25,   30,   40,   50,   60,   70,   80,   90,  100,  100],
[20,   25,   30,   40,   50,   60,   70,   80,   90,  100,  100,  100],
[25,   30,   40,   50,   60,   70,   80,   90,  100,  100,  100,  100],
[30,   40,   50,   60,   70,   80,   90,  100,  100,  100,  100,  100],
[40,   50,   60,   70,   80,   90,  100,  100,  100,  100,  100,  100] 
]

Phases = ["rangedsp","directsp","closesp","indirect","underwater","air","direct","close"];

function getDamage(attack,armour)
{   if(attack > armour)
    {   at = Math.floor(attack/armour);
        at = at + 3;
    }
    else
    {   at = Math.floor(armour/attack)
        at = 5 - at;
    }
    if(at>11) at=11;
    if(at<0) at = 0;
    row = rnd(10);
    //console.log([at,row,DMG[row][at]]);
    return DMG[row][at];
}

function rnd(n)
{   return Math.floor(Math.random()*n);
}

function getAttacks(phase)
{   return NumberOfAttacks[phase];
}

function canAttack(phase,defender)
{   if(AttackVsMovement[defender.movement].indexOf(phase) > -1) return true;
    return false;
}