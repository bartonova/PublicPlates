package com.freedata.plates.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Plate.
 */
@Entity
@Table(name = "plate")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "plate")
public class Plate implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plate_title")
    private String plateTitle;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(name = "plate_note",
               joinColumns = @JoinColumn(name = "plate_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "note_id", referencedColumnName = "id"))
    private Set<Note> notes = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = "plates", allowSetters = true)
    private Person person;

    // freedata-needle-entity-add-field - freedata will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlateTitle() {
        return plateTitle;
    }

    public Plate plateTitle(String plateTitle) {
        this.plateTitle = plateTitle;
        return this;
    }

    public void setPlateTitle(String plateTitle) {
        this.plateTitle = plateTitle;
    }

    public Set<Note> getNotes() {
        return notes;
    }

    public Plate notes(Set<Note> notes) {
        this.notes = notes;
        return this;
    }

    public Plate addNote(Note note) {
        this.notes.add(note);
        note.getPlates().add(this);
        return this;
    }

    public Plate removeNote(Note note) {
        this.notes.remove(note);
        note.getPlates().remove(this);
        return this;
    }

    public void setNotes(Set<Note> notes) {
        this.notes = notes;
    }

    public Person getPerson() {
        return person;
    }

    public Plate person(Person person) {
        this.person = person;
        return this;
    }

    public void setPerson(Person person) {
        this.person = person;
    }
    // freedata-needle-entity-add-getters-setters - freedata will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Plate)) {
            return false;
        }
        return id != null && id.equals(((Plate) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Plate{" +
            "id=" + getId() +
            ", plateTitle='" + getPlateTitle() + "'" +
            "}";
    }
}
