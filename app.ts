import * as readline from 'readline';
import { promisify } from 'util'
var readlineSync = require('readline-sync');



import { App } from "./TestApp";
import { Tamagotchi } from "./src/Tamagotchi";
import { GameStrings } from './src/consts/GameStrings';
///  </summary>

    try {
        // code that may throw an error...



        let tama: Tamagotchi.Tamagotchi;
        tama = new Tamagotchi.Tamagotchi(new Date());

        //  Read in save game - Need to implement
        let filepath: string = "./SaveFile.tama";
        let TamagotchiExists: boolean = CheckForFile(filepath);

        if (!TamagotchiExists) {

            //  New Tamagotchi
            console.log(GameStrings.WelcomeMessage);

            tama = new Tamagotchi.Tamagotchi(new Date());

            //  name the Tamagotchi
            console.log(GameStrings.NameYourTamagotchi);

            var name = readlineSync.question('Name Your Tamagotchi >> ');
            tama.Name(name);
            //  Show START and HELP instructions
            console.log(GameStrings.GameStart);
            console.log(GameStrings.HelpMessage);

            //  Print out status
            console.log(tama.GetStatus());
         

        }
        else {
            // Read in saved game
            tama = ReadFile(filepath);

            //  Print out status
            console.log(tama.GetStatus());
        }


        function  MainLoop() {
            while (true) {

                var input = readlineSync.question('>>');

                //  Check for quit
                if ((input.toLowerCase() == GameStrings.QUIT)) {
                    return;
                }

                //  Process command
                let result: string = tama.ProcessCommand(input);
                if ((result != "")) {
                    console.log(result);
                }

                                





            }
        }

        function CheckForFile(filepath: string): boolean {

            // Search for file
            return false;

        }

        function ReadFile(filepath: string): Tamagotchi.Tamagotchi {

            // TO IMPLEMENT - Read and Deserialise file
            let new_tamagotchi: Tamagotchi.Tamagotchi = new Tamagotchi.Tamagotchi(new Date());
            return new_tamagotchi;
        }

        // Save file
        function SaveTamagotchi(input: Tamagotchi.Tamagotchi, filepath: string) {

            // to implement

        }


        MainLoop();
    
    }
    catch (e) {
        console.log(e);
    }
