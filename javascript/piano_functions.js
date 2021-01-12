function note_on_synthesizer(noteNumber) {
    playSound(bufferLoaderPiano.bufferList[noteNumber - mini_midi_piano - 12], volume_1);
}