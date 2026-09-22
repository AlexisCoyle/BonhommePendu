using System.Text.Json.Serialization;

namespace BonhommePendu.Events
{
    // Les événements sont tous déjà enregistrés, SAUF Win
    [JsonDerivedType(typeof(GuessEvent))]
    [JsonDerivedType(typeof(WrongGuessEvent))]
    [JsonDerivedType(typeof(RevealLetterEvent))]
    [JsonDerivedType(typeof(LostEvent))]
    [JsonDerivedType(typeof(GuessedLetterEvent))]
    [JsonDerivedType(typeof(WonEvent))]
    public abstract class GameEvent
    {
        public abstract string EventType { get; }
        public List<GameEvent>? Events { get; set; }
    }
}
