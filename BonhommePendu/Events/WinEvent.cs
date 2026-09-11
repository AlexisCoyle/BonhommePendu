using BonhommePendu.Models;

namespace BonhommePendu.Events
{
    // Un événement à créer si toutes les lettres du mot ont été trouvées
    public class WinEvent : GameEvent
    {
        public override string EventType { get { return "Win"; } }

        // TODO: Compléter
        public WinEvent(GameData gameData) {
            gameData.Won = true;
        }
    }
}
