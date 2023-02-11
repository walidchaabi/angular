package io.ServerApp.server;

import io.ServerApp.server.enumerarion.Status;
import io.ServerApp.server.model.Server;
import io.ServerApp.server.repo.ServerRepo;
import org.apache.catalina.filters.CorsFilter;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.lang.reflect.Array;
import java.util.Arrays;

import static io.ServerApp.server.enumerarion.Status.SERVER_UP;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}
	@Bean
	CommandLineRunner run(ServerRepo serverRepo){
		return args -> {
//			serverRepo.save(new Server(null,"192.168.1.160","Ubuntu Linux","16 GB","Personal Pc",
//					"http://localhost:8080/server/image/server1.png", SERVER_UP));
//			serverRepo.save(new Server(null,"192.168.1.58","Ubuntu Linux","16 GB","Dell tower",
//					"http://localhost:8080/server/image/server1.png", SERVER_UP));
//			serverRepo.save(new Server(null,"192.168.1.16","Ubuntu Linux","32 GB","Web Sever",
//					"http://localhost:8080/server/image/server1.png", SERVER_UP));
//			serverRepo.save(new Server(null,"192.168.1.21","Ubuntu Linux","64 GB","Mail Server",
//					"http://localhost:8080/server/image/server1.png", SERVER_UP));
		};
	}
/*	@Bean
	public CorsFilter corsFilter(){
		UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		corsConfiguration.setAllowCredentials(true);
		corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:3000","http://localhost:4200"));
		corsConfiguration.setAllowedHeaders(Arrays.asList("Origin","Access-Control-Allow-Origin","Content-type",
				"Accept","Jwt-Token","Authorization","Origin,accept","X-requested-With",
				"access-Control-Request-Method","Access-Control-Request-Headers"));
		corsConfiguration.setExposedHeaders(Arrays.asList("Origin","Accept","Access-Control-Allow-Origin","Jwt-Token","Content-type",
			"Authorization","filename","Access-Control-Allow-Credentials",
				"access-Control-Request-Method","Access-Control-Request-Headers"));
		corsConfiguration.setAllowedMethods(Arrays.asList("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
		urlBasedCorsConfigurationSource.registerCorsConfiguration("/**",corsConfiguration);
		return new CorsFilter();
	}*/

@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("*")
						.allowedMethods("GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS");
			}
		};
	}
}
