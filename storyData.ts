import { StoryNode, ItemType, Item } from './types';

// Define some items
const rustyPipe: Item = { id: 'pipe', name: 'Rostigt Rör', description: 'Bättre än inget.', type: ItemType.WEAPON, value: 2 };
const laserPistol: Item = { id: 'laser_pistol', name: 'Laserpistol', description: 'Standardvapen inom federationen.', type: ItemType.WEAPON, value: 5 };
const medkit: Item = { id: 'medkit', name: 'Nano-Förbandslåda', description: 'Läker 10 HP.', type: ItemType.CONSUMABLE, value: 10 };
const keycard: Item = { id: 'red_keycard', name: 'Rött Nyckelkort', description: 'Ger tillgång till underhåll.', type: ItemType.KEY, value: 0 };
const spaceSuit: Item = { id: 'spacesuit', name: 'EVA-Dräkt', description: 'Skyddar mot vakuum.', type: ItemType.ARMOR, value: 3 };

export const INITIAL_NODES: Record<string, StoryNode> = {
  'start': {
    id: 'start',
    title: 'Uppvaknandet',
    text: 'Du vaknar i en kryokammare. Luften är iskall och luktar ozon. Röda nödljus pulserar rytmiskt i mörkret. Skeppets AI meddelar med monoton röst: "Kritisk systemkollaps. Utrym omedelbart."',
    options: [
      {
        id: 'opt_force',
        text: 'Tvinga upp dörren med våld',
        targetNodeIdSuccess: 'corridor_safe',
        targetNodeIdFail: 'sickbay_injured',
        difficulty: 10, // Strength check
      },
      {
        id: 'opt_hack',
        text: 'Hacka kontrollpanelen',
        targetNodeIdSuccess: 'corridor_stealth',
        targetNodeIdFail: 'start_fail',
        difficulty: 12, // Int check
      }
    ]
  },
  'start_fail': {
    id: 'start_fail',
    title: 'Tekniskt Fel',
    text: 'Du fumlar med kablarna. Gnistor flyger och ger dig en rejäl stöt. Dörren förblir låst en stund innan nödutlösningen aktiveras automatiskt.',
    options: [
      { id: 'opt_recover', text: 'Snubbla ut i korridoren', targetNodeIdSuccess: 'corridor_safe' }
    ],
    rewards: [] // Could deduct HP logic in component
  },
  'sickbay_injured': {
    id: 'sickbay_injured',
    title: 'Råstyrka',
    text: 'Du slår sönder glaset. Det splittras och skär dig i armen, men du ramlar ut. Du befinner dig i sjukstugan. Det är en enda röra här inne.',
    options: [
      { id: 'opt_search', text: 'Leta efter förnödenheter', targetNodeIdSuccess: 'sickbay_looted', difficulty: 5 },
      { id: 'opt_leave', text: 'Lämna rummet omedelbart', targetNodeIdSuccess: 'corridor_safe' }
    ]
  },
  'sickbay_looted': {
    id: 'sickbay_looted',
    title: 'Förnödenheter',
    text: 'Du rotar igenom skåpen och hittar ett medicinskt paket bland bråten.',
    rewards: [medkit],
    options: [
      { id: 'opt_corridor', text: 'Gå ut i korridoren', targetNodeIdSuccess: 'corridor_safe' }
    ]
  },
  'corridor_stealth': {
    id: 'corridor_stealth',
    title: 'Tyst Utgång',
    text: 'Dörren glider upp helt ljudlöst. Du kliver ut i korridoren. En säkerhetsdrönare svävar längre bort i hallen, vänd bortåt.',
    options: [
      { id: 'opt_sneak', text: 'Smyg förbi drönaren', targetNodeIdSuccess: 'bridge', difficulty: 14 },
      { id: 'opt_attack', text: 'Bakhåll mot drönaren', targetNodeIdSuccess: 'drone_fight', difficulty: 8 }
    ]
  },
  'corridor_safe': {
    id: 'corridor_safe',
    title: 'Huvudkorridoren',
    text: 'Huvudkorridoren är fylld av tjock rök. Bråte blockerar vägen till maskinrummet. Du ser en död vakt som krampaktigt håller i ett vapen.',
    rewards: [laserPistol],
    options: [
      { id: 'opt_take_gun', text: 'Ta pistolen och gå till Bryggan', targetNodeIdSuccess: 'bridge' },
      { id: 'opt_maintenance', text: 'Leta efter ett underhållsschakt', targetNodeIdSuccess: 'maintenance', difficulty: 10 }
    ]
  },
  'maintenance': {
    id: 'maintenance',
    title: 'Mörka Schakt',
    text: 'Det är mörkt och trångt. Du hittar liket av en tekniker som fastnat här.',
    rewards: [keycard, rustyPipe],
    options: [
      { id: 'opt_climb', text: 'Klättra upp till Bryggan', targetNodeIdSuccess: 'bridge' }
    ]
  },
  'drone_fight': {
    id: 'drone_fight',
    title: 'Strid!',
    text: 'Du kastar dig mot drönaren. Den snurrar runt och börjar ladda sin laserkanon.',
    options: [
        { id: 'opt_dodge', text: 'Ducka och slå till', targetNodeIdSuccess: 'bridge', targetNodeIdFail: 'bridge_injured', difficulty: 12}
    ]
  },
  'bridge': {
    id: 'bridge',
    title: 'Bryggan',
    text: 'Du når kommandodäcket. Kaptensstolen är tom. Bildskärmen visar ett svart hål som långsamt slukar stjärnorna. En sista flyktkapsel är förberedd.',
    options: [
      { id: 'opt_launch', text: 'Starta Flyktkapsel', targetNodeIdSuccess: 'end_survival', difficulty: 0 }
    ]
  },
  'bridge_injured': {
    id: 'bridge_injured',
    title: 'Skadad Ankomst',
    text: 'Du besegrade drönaren men fick ett brännsår av lasern. Du stapplar in på Bryggan, utmattad.',
    options: [
      { id: 'opt_launch', text: 'Starta Flyktkapsel', targetNodeIdSuccess: 'end_survival' }
    ]
  },
  'end_survival': {
    id: 'end_survival',
    title: 'Flykten',
    text: 'Kapseln skjuts ut ögonblicket innan skeppet slits isär av gravitationskrafterna. Du driver i tystnad genom rymden och väntar på räddning. Du har överlevt.',
    options: [],
    isEnding: true
  }
};