import assert = require('assert');
import { Tamagotchi } from '../src/Tamagotchi';
import { GameConsts } from '../GameConsts';
import { GameEvents } from '../GameEvents';


import { Lifecycle } from '../Lifecycle';
import { TestRandom, AddMinutes } from '../TamagotchiRandom'; 


///  <summary>
///  Tests for Tamagotchi evolution and life cycle
///  </summary>

let test_tama: Tamagotchi.Tamagotchi;
let TamagotchiName: string = "TEST";



function Setup() {

    //TestContext.WriteLine("Create Test Tamagotchi called TEST ");
    this.test_tama = new Tamagotchi.Tamagotchi(new Date());
    this.test_tama.Name(TamagotchiName);
};

export function BeginwithFullHunger() {

    Setup();

    assert.ok((this.test_tama.hungrymeter == GameConsts.HUNGRYMAX));
};

export function HungerDecreasesOverTime() {

    Setup();

    //  Created Tamagotchi

    let previous: Date = AddMinutes(new Date(), - (GameConsts.HUNGRYMINUTES + 1));
    this.test_tama = new Tamagotchi.Tamagotchi(previous);
    this.test_tama.Name("TEST");

    //  Trigger hunger event
    let hungerrandom: TestRandom = new TestRandom(GameEvents.Event_Hunger);
    this.test_tama.random = hungerrandom;

    //  run gameloop
    this.test_tama.GameLoop(new Date());

    //  Should have lost health
    assert.ok((this.test_tama.hungrymeter < GameConsts.HUNGRYMAX));
};

export function AbleToBeFed() {

    Setup();

    //  Created Tamagotchi a while ago
    let previous: Date = AddMinutes(new Date(), -(GameConsts.HUNGRYMINUTES + 1));
    this.test_tama = new Tamagotchi.Tamagotchi(previous);
    this.test_tama.Name("TEST");

    //  Create Hunger
    let hungerrandom: TestRandom = new TestRandom(GameEvents.Event_Hunger);
    this.test_tama.random = hungerrandom;

    //  Run game loop - up to date
    this.test_tama.GameLoop(new Date());

    //  Tamagotchi should be hungry
    assert.ok((this.test_tama.hungrymeter < GameConsts.HUNGRYMAX));

    //  make sure awake - cannot feed a sleeping tamagotchi
    this.test_tama.sleep = false;

    //  Feed the Tamagotchi
    for (let i: number = 0; (i < GameConsts.HUNGRYMAX); i++) {
        this.test_tama.Feed(new Date());
    }

    //  Should be full
    assert.ok((this.test_tama.hungrymeter == GameConsts.HUNGRYMAX));

};

export function LooseHealthFromhunger() {

    Setup();

    //  Change to infant
    this.test_tama.Evolve(new Date());
    assert.ok((this.test_tama.health == GameConsts.HEALTHMAX));

    //  create hunger
    this.test_tama.hungrymeter = (GameConsts.HUNGRYHEALTHLEVEL - 1);

    //  Create Hunger trigger
    let hungerrandom: TestRandom = new TestRandom(GameEvents.HealthDrop_Hunger);
    this.test_tama.random = hungerrandom;

    //  Run gameloop
    let future: Date = AddMinutes(new Date(), 1);
    this.test_tama.GameLoop(future);

    //  should have lost health
    assert.ok((this.test_tama.health < GameConsts.HEALTHMAX));

};
    
