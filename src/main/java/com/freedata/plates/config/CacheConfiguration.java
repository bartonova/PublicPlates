package com.freedata.plates.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import org.hibernate.cache.jcache.ConfigSettings;
import io.github.freedata.config.freedataProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import io.github.freedata.config.cache.PrefixedKeyGenerator;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {
    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(freedataProperties freedataProperties) {
        freedataProperties.Cache.Ehcache ehcache = freedataProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.freedata.plates.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.freedata.plates.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.freedata.plates.domain.User.class.getName());
            createCache(cm, com.freedata.plates.domain.Authority.class.getName());
            createCache(cm, com.freedata.plates.domain.User.class.getName() + ".authorities");
            createCache(cm, com.freedata.plates.domain.Region.class.getName());
            createCache(cm, com.freedata.plates.domain.Country.class.getName());
            createCache(cm, com.freedata.plates.domain.Location.class.getName());
            createCache(cm, com.freedata.plates.domain.Department.class.getName());
            createCache(cm, com.freedata.plates.domain.Department.class.getName() + ".people");
            createCache(cm, com.freedata.plates.domain.Note.class.getName());
            createCache(cm, com.freedata.plates.domain.Note.class.getName() + ".plates");
            createCache(cm, com.freedata.plates.domain.Person.class.getName());
            createCache(cm, com.freedata.plates.domain.Person.class.getName() + ".plates");
            createCache(cm, com.freedata.plates.domain.Plate.class.getName());
            createCache(cm, com.freedata.plates.domain.Plate.class.getName() + ".notes");
            createCache(cm, com.freedata.plates.domain.PlateHistory.class.getName());
            // freedata-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache == null) {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
