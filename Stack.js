function Stack() {
    this.slots = [];
    this.active_slot = -1;
}
Stack.prototype.Add = function(unit) {
    for(var i=0; i<this.slots.length; i++)
    {   if(this.slots[i].unit.rank > unit.rank)
        {   break;
        }
    }
    this.slots.splice(i,0,{dead:false,damage:0,unit:unit});
    unit.slot = this.slots[i];
}
Stack.prototype.clearDamage = function() {
    i=0;
    for (var i = 0; i < this.slots.length; i++) 
    {   this.slots[i].damage=0;
    }
}
Stack.prototype.applyDamage = function() {
    i=0;
    console.log('deaths');
    for (var i = this.slots.length-1; i >= 0; i--) 
    {   if(this.slots[i].dead) continue;
        this.slots[i].unit.hp-=this.slots[i].damage;
        dmg = this.slots[i].damage;
        //this.slots[i].damage=0;
        if(this.slots[i].unit.hp<1)
        {   console.log([i,dmg,this.slots[i].unit]);
            this.slots[i].dead = true;
        }
    }
}
Stack.prototype.removeCasualties = function() {
    for (var i = this.slots.length-1; i >= 0; i--) 
    {   if(this.slots[i].dead)
        {   this.slots.splice(i, 1);
            
        }
    }
}
Stack.prototype.generateRandomTable = function(phase) {
    var rndTab = [];
    for(var i=0; i<this.slots.length; i++)
    {   /* check versus hp needed, dead status is awarded at end of phase, but I see I killed the unit, and want to switch to another */
        if(canAttack(phase,this.slots[i].unit) && (this.slots[i].unit.hp - this.slots[i].damage) > 0 && !this.slots[i].routed)
        {
            for(j=0; j<this.slots[i].unit.rank; j++)
            {   rndTab.push(i);
            }
        }
    }
    return rndTab;
}
Stack.prototype.getTarget = function(phase,attacker) {
    if(!attacker.attacks[phase]) return false;
    /* regenerate random table to account for dead units */
    table = this.generateRandomTable(phase);
    if(!table.length) return false;
    r = rnd(table.length);
    return this.slots[table[r]].unit;
    return false;
}
Stack.prototype.getSpotting = function() {
    var ret = 0;
    for(var i=0; i<this.slots.length; i++)
    {   if(this.slots[i].unit.spot > ret) ret = this.slots[i].unit.spot;
    }
    return ret;
}