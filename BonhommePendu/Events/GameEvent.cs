using System.Text.Json.Serialization;

namespace BonhommePendu.Events
{
    // Les événements sont tous déjà enregistrés, SAUF Win
    [JsonDerivedType(typeof(GuessEvent))]
    [JsonDerivedType(typeof(WrongGuessEvent))]
    [JsonDerivedType(typeof(RevealLetterEvent))]
    [JsonDerivedType(typeof(WinEvent))]
    [JsonDerivedType(typeof(LoseEvent))]
    [JsonDerivedType(typeof(GuessedLetterEvent))]
    public abstract class GameEvent
    {
        public abstract string EventType { get; }
        public List<GameEvent>? Events { get; set; }
    }
}
