import assert = require('assert');
import { Tamagotchi } from '../src/Tamagotchi';
import { GameConsts } from '../GameConsts';
import { GameEvents } from '../GameEvents';


import { Lifecycle } from '../Lifecycle';
import { TestRandom } from '../TamagotchiRandom'; 

///  <summary>
///  Tests for Game Items
///  </summary>

let test_tama: Tamagotchi.Tamagotchi;
let TamagotchiName: string = "TEST";



function Setup() {

    this.test_tama = new Tamagotchi.Tamagotchi(new Date());
    this.test_tama.Name(TamagotchiName);
};


export function CheckStartWeight() {
    Setup();
    assert.ok((this.test_tama.Weight == GameConsts.STARTWEIGHT));
};

export function CheckWeightIncreasesWhenFed() {

    Setup();

    //  Start at startweight
    assert.ok((this.test_tama.Weight == GameConsts.STARTWEIGHT));

    //  make tamagotchi hungry
    this.test_tama.hungrymeter = 1;

    //  feed
    this.test_tama.Feed(new Date());
    this.test_tama.Feed(new Date());
    this.test_tama.Feed(new Date());
    this.test_tama.Feed(new Date());
    this.test_tama.Feed(new Date());

    //  weight should have increased
    assert.ok((this.test_tama.Weight > GameConsts.STARTWEIGHT));
};
