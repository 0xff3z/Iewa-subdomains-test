package iewa.api.Controller.Authentication;


import iewa.api.Config.ApiResponseDTO;
import iewa.api.Config.JwtUtil;
import iewa.api.DTO.BusinessOwner.LoginBusinessOwnerDTO;
import iewa.api.DTO.BusinessOwner.RegisterBusinessOwnerDTO;
import iewa.api.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register/business-owner")
    public ResponseEntity<?> register(
            @RequestBody RegisterBusinessOwnerDTO registerBusinessOwnerDTO){
       try {
              return userService.registerBusinessOwner(registerBusinessOwnerDTO);
       }
         catch (Exception e){
                return ResponseEntity.badRequest().body("Error: " + e.getMessage());
         }

    }

    @PostMapping("/login/business-owner")
    public ResponseEntity<?> login(
            @RequestBody LoginBusinessOwnerDTO loginBusinessOwnerDTO){
        try {
           return userService.loginBusinessOwner(loginBusinessOwnerDTO);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }

    }
}
