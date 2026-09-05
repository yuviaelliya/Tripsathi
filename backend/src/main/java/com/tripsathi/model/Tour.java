package com.tripsathi.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tours")
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private Long agencyId;
    private String agencyName = "TripSathi Official";

    @Column(nullable = false)
    private String city;

    private String address = "";
    private Double distance = 100.0;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String photo;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String desc;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer maxGroupSize = 10;

    private String category = "Adventure";
    private String duration = "3 Days / 2 Nights";
    private String roomType = "3-Star Deluxe Hotel & Resort";
    private Boolean featured = false;
    private Double rating = 4.8;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tour_inclusions", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "inclusion")
    private List<String> inclusions = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tour_exclusions", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "exclusion")
    private List<String> exclusions = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tour_dates", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "available_date")
    private List<String> availableDates = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Tour() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @JsonProperty("_id")
    public String get_id() {
        return id != null ? id.toString() : null;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getAgencyId() { return agencyId; }
    public void setAgencyId(Long agencyId) { this.agencyId = agencyId; }

    public String getAgencyName() { return agencyName; }
    public void setAgencyName(String agencyName) { this.agencyName = agencyName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }

    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getMaxGroupSize() { return maxGroupSize; }
    public void setMaxGroupSize(Integer maxGroupSize) { this.maxGroupSize = maxGroupSize; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public List<String> getInclusions() { return inclusions; }
    public void setInclusions(List<String> inclusions) { this.inclusions = inclusions; }

    public List<String> getExclusions() { return exclusions; }
    public void setExclusions(List<String> exclusions) { this.exclusions = exclusions; }

    public List<String> getAvailableDates() { return availableDates; }
    public void setAvailableDates(List<String> availableDates) { this.availableDates = availableDates; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
