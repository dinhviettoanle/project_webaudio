function note_on_piano(noteNumber) {
    if (piano_sampler_is_loaded) {
        sampler_piano.triggerAttackRelease([Tone.Frequency(noteNumber, "midi").toNote()], 4)
    }
}