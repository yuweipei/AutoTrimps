//AB

function getCurrentAB(effect) {

    if (effect == false) {
      return autoBattle.enemyLevel;
    }
    else {
        var poison = autoBattle.enemy.poisonResist;
        var bleed = autoBattle.enemy.bleedResist;
        var shock = autoBattle.enemy.shockResist;

        var lowestResist = Math.min(poison,bleed,shock);

        var outEffect = "";
        if (poison == lowestResist) {
            outEffect += "p";
        }
        if (bleed == lowestResist) {
            outEffect += "b";
        }
        if (shock == lowestResist) {
            outEffect += "s";
        }

        return outEffect;
    }
};

function checkPreset(presetSlot) {

    for (var item in autoBattle.items) {
        if (autoBattle.items[item].equipped && autoBattle.presets["p" + presetSlot].indexOf(item) == -1) {
            return false;
        }
    }
    return true;
}

function ABcheck() {

    var winning = autoBattle.sessionEnemiesKilled >= autoBattle.sessionTrimpsKilled;

    if (winning) return 0;

    if (getCurrentAB(true) == "pbs" && (checkPreset(1) || checkPreset(2) || checkPreset(3))) {
        if (checkPreset(1)) return 2;
        else if (checkPreset(2)) return 3;
        else if (checkPreset(3)) return 1;
    }
    else if (getCurrentAB(true) == "pb" && (checkPreset(1) || checkPreset(2))) {
        if (checkPreset(1)) return 2;
        else if (checkPreset(2)) return 1;
    }
    else if (getCurrentAB(true) == "ps" && (checkPreset(1) || checkPreset(3))) {
        if (checkPreset(1)) return 3;
        else if (checkPreset(3)) return 1;
    }
    else if (getCurrentAB(true) == "bs" && (checkPreset(2) || checkPreset(3))) {
        if (checkPreset(2)) return 3;
        else if (checkPreset(3)) return 2;
    }
    else if (getCurrentAB(true) == "p" && (checkPreset(2) || checkPreset(3))) {
        return 1;
    }
    else if (getCurrentAB(true) == "b" && (checkPreset(1) || checkPreset(3))) {
        return 2;
    }
    else if (getCurrentAB(true) == "s" && (checkPreset(1) || checkPreset(2))) {
        return 3;
    }
}

function ABswitch() {

    if (ABcheck() > 0) {
        if (ABcheck() == 1) autoBattle.loadPreset('p1');
        else if (ABcheck() == 2) autoBattle.loadPreset('p2');
        else if (ABcheck() == 3) autoBattle.loadPreset('p3');
    }
}

function ABdustsimple() {
    
    var equips = [];
    
    for (var item in autoBattle.items) {
        if (autoBattle.items[item].equipped) {
            equips.push([item, autoBattle.upgradeCost(item)]);
        }
    }

    equips.sort(function(a, b) {
        return a[1] - b[1]; 
    });

    if (autoBattle.dust >= equips[0][1]) autoBattle.upgrade(equips[0][0]);
}

function ABdustsimplenonhid() {
    
    var equips = [];
    
    for (var item in autoBattle.items) {
        if (!autoBattle.items[item].equipped && !autoBattle.items[item].hidden) {
            equips.push([item, autoBattle.upgradeCost(item)]);
        }
    }

    equips.sort(function(a, b) {
        return a[1] - b[1]; 
    });

    if (autoBattle.dust >= equips[0][1]) autoBattle.upgrade(equips[0][0]);
}

function ABfarmsave() {

    var equips = [];
    
    for (var item in autoBattle.items) {
        if (autoBattle.items[item].equipped) {
            equips.push(item);
        }
    }

    var dustps = parseInt(autoBattle.getDustPs());
 
    var bestdust = 0;
    if (autoBattle.sessionEnemiesKilled > 2 && autoBattle.sessionEnemiesKilled > autoBattle.sessionTrimpsKilled) bestdust = dustps;

    var string = [autoBattle.enemyLevel, bestdust, equips];

    if (getPageSetting('RABfarmstring') == "-1") {
        setPageSetting('RABfarmstring', string);
    }
    else if (autoBattle.sessionEnemiesKilled > 8 && autoBattle.sessionEnemiesKilled > autoBattle.sessionTrimpsKilled && bestdust > 0 && autoTrimpSettings.RABfarmstring.value[1] < bestdust) {
        setPageSetting('RABfarmstring', string);
    }
}

function ABfarmswitch() {

    if (autoBattle.enemyLevel != getPageSetting('RABfarmstring')[0]) {
        autoBattle.enemyLevel = getPageSetting('RABfarmstring')[0];
        autoBattle.resetCombat(true)
    }

    var match = false;

    for (var item in autoBattle.items) {
        if (autoBattle.items[item].equipped && getPageSetting('RABfarmstring')[2].indexOf(item) == -1) {
            match = true;
        }
    }

    if (match) {
        var preset = getPageSetting('RABfarmstring')[2];
        var plength = preset.length;
        if (plength > autoBattle.getMaxItems()) plength = autoBattle.getMaxItems();
        for (var item in autoBattle.items){
             autoBattle.items[item].equipped = false;
             if (autoBattle.settings.loadHide.enabled) autoBattle.items[item].hidden = (autoBattle.items[item].owned) ? true : false;
        }
        for (var x = 0; x < plength; x++){
            if (!autoBattle.items[preset[x]] || !autoBattle.items[preset[x]].owned) continue;
                autoBattle.items[preset[x]].equipped = true;
                autoBattle.items[preset[x]].hidden = false;
        }
        autoBattle.resetCombat(true);
    }
}

function ABsolver() {

    if (autoBattle.autoLevel) autoBattle.toggleAutoLevel();

    var max = autoBattle.maxEnemyLevel;
    var items = [];
    var level = [];

    //Solver

    switch(max) {
        case 1:
        items = ['Sword','Armor','Fists_of_Goo','Battery_Stick'];
        level = [2,1,1,1];
        if (autoBattle.enemyLevel != 1) {
            autoBattle.enemyLevel = 1;
            autoBattle.resetCombat(true);
        }
		break;
        case 2:
        items = ['Sword','Armor','Fists_of_Goo','Battery_Stick'];
        level = [3,2,1,2];
        if (autoBattle.enemyLevel != 2) {
            autoBattle.enemyLevel = 2;
            autoBattle.resetCombat(true);
        }
		break;
        case 3:
        if (autoBattle.bonuses.Extra_Limbs.level < 1) {
            items = ['Sword','Armor','Fists_of_Goo','Battery_Stick'];
            level = [4,2,2,2];
            for (var equip in autoBattle.items) {
                if (autoBattle.items[equip].level < level[items.indexOf(equip)]) {
                    if (autoBattle.enemyLevel != 2) {
                        autoBattle.enemyLevel = 2;
                        autoBattle.resetCombat(true);
                    }
                }
                if (autoBattle.items[equip].level >= level[items.indexOf(equip)]) {
                    if (autoBattle.bonuses.Extra_Limbs.level < 1) {
                        autoBattle.buyBonus('Extra_Limbs');
                    }
                }
            }
        }
        
        if (autoBattle.bonuses.Extra_Limbs.level >= 1) {
            items = ['Sword','Armor','Fists_of_Goo','Battery_Stick','Pants'];
            level = [4,3,2,2,4];
	    var proceed = true;
            for (var equip in autoBattle.items) {
                if (autoBattle.items[equip].level < level[items.indexOf(equip)]) {
		    proceed = false;
                    if (autoBattle.enemyLevel != 2) {
                        autoBattle.enemyLevel = 2;
                        autoBattle.resetCombat(true);
                        console.log("not level 2");
                    }
                }
                if (proceed && autoBattle.items[equip].level >= level[items.indexOf(equip)]) {
                    if (autoBattle.enemyLevel != 3) {
                        autoBattle.enemyLevel = 3;
                        autoBattle.resetCombat(true);
                        console.log("not level 3");
                    }
                }
            }
        }
	break;
    }

    //Equip items
    
    var needsEquipChange = false;

    for (var item of items) {
        if (autoBattle.items[item].equipped == false) { needsEquipChange = true;}
    }

    if (needsEquipChange) {
        for (var item in autoBattle.items) {
            autoBattle.items[item].equipped = false;
        };

        for (var item of items) {
            autoBattle.equip(item);
        }
    }

    //Level items
    
    for (var equip in autoBattle.items) {
        if (autoBattle.items[equip].level < level[items.indexOf(equip)]) {
            autoBattle.upgrade(equip);
        }
    }
    
}
