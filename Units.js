Units = [
{
    id: 0,
    name: "Militia",
    spot: 4,
    camo: 1,
    agility: 4,
    armour: 10,
    movement: "foot",
    attacks: {air:[3,10],close:[3,30]},
    rank: 4,
    level: 2,
    hp: 100,
    morale: 80,
},
{
    id: 1,
    name: "Medium Tank",
    spot: 3,
    camo: 2,
    agility: 4,
    armour: 40,
    movement: "tread",
    attacks: {air:[3,20],direct:[5,60],close:[4,50]},
    rank: 2,
    level: 2,
    hp: 100,
    morale: 80,
},
{
    id: 2,
    name: "AT-gun",
    spot: 4,
    camo: 2,
    agility: 3,
    armour: 20,
    movement: "wheel",
    attacks: {air:[3,10],direct:[7,70],close:[3,30]},
    rank: 6,
    level: 2,
    hp: 100,
    morale: 80,
},
{
    id: 0,
    name: "Light Infantry",
    spot: 4,
    camo: 3,
    agility: 4,
    armour: 15,
    movement: "foot",
    attacks: {air:[3,20],close:[4,40]},
    rank: 4,
    level: 2,
    hp: 100,
    morale: 80,
},
{
    id: 0,
    name: "Artillery",
    spot: 4,
    camo: 2,
    agility: 3,
    armour: 20,
    movement: "wheel",
    attacks: {air:[3,10],indirect:[3,80],close:[3,30]},
    rank: 6,
    level: 2,
    hp: 100,
    morale: 80,
},
];

var globalId = 0;

function createUnit(id)
{   template = Units[id];
    var copy = template.constructor();
    for (var attr in template) {
        if (template.hasOwnProperty(attr)) copy[attr] = template[attr];
    }
    copy.id = globalId;
    globalId ++ ;
    return copy;
}