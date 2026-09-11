using BonhommePendu.Models;

namespace BonhommePendu.Events
{
    // Un événement à créer si toutes les lettres du mot ont été trouvées
    public class WonEvent : GameEvent
    {
        public override string EventType { get { return "Won"; } }

        public WonEvent(GameData gameData) {
            gameData.Won = true;
        }
    }
}
