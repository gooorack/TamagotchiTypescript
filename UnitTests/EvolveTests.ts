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

    export function StartAsAnEgg() {
        Setup();
        assert.ok((this.test_tama.status == Lifecycle.egg));
    };

   
    export function ShouldEvolveAfterXMinutes() {

        //  Created Tamagotchi a while ago
        //  start as an egg
        assert.ok((this.test_tama.status == Lifecycle.egg));


        //  no random events
        let hungerrandom: TestRandom = new TestRandom(GameEvents.Event_Nothing);
        this.test_tama.random = hungerrandom;

        //  Move into the future
        let future: Date = AddMinutes(new Date(), (GameConsts.EVOLVETIMERMIUTES + 1));
        this.test_tama.GameLoop(future);

        //  Should have evolved
        assert.ok((this.test_tama.status == Lifecycle.infant));

    };


    export function CheckEvolvePath() {



        //  Created Tamagotchi
        this.test_tama = new Tamagotchi.Tamagotchi(new Date());
        this.test_tama.Name("TEST");

        //  Disable all random events
        let nothingrandom: TestRandom = new TestRandom(GameEvents.Event_Nothing);
        this.test_tama.random = nothingrandom;

        //  Start as an egg
        assert.ok((this.test_tama.alive == true));
        assert.ok((this.test_tama.status == Lifecycle.egg));

        //  Evolve into an Infant
        let future: Date = AddMinutes(new Date(), (GameConsts.EVOLVETIMERMIUTES + 1));
        this.test_tama.GameLoop(future);
        assert.ok((this.test_tama.status == Lifecycle.infant));

        //  Evolve into a teen
        let future2: Date = AddMinutes(new Date(), (GameConsts.EVOLVETIMERMIUTES + 1));
        this.test_tama.GameLoop(future2);
        assert.ok((this.test_tama.status == Lifecycle.teen));

        //  Evolve into an Adult
        let future3: Date = AddMinutes(new Date(), (GameConsts.EVOLVETIMERMIUTES + 1));
        this.test_tama.GameLoop(future3);
        assert.ok((this.test_tama.status == Lifecycle.adult));

        //  Evolve into Elderly
        let future4: Date = AddMinutes(new Date(), (GameConsts.EVOLVETIMERMIUTES + 1));
        this.test_tama.GameLoop(future4);
        assert.ok((this.test_tama.status == Lifecycle.elderly));

        //  Die
        let future5: Date = AddMinutes(new Date(), (GameConsts.EVOLVETIMERMIUTES + 1));
        this.test_tama.GameLoop(future5);
        assert.ok((this.test_tama.alive == false));

    };

    export function Test1() {
        assert.ok(true, "This shouldn't fail");
    };

    export function Test2() {
        assert.ok(1 === 1, "This shouldn't fail");
        assert.ok(false, "This should fail");
    };


