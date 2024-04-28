package iewa.api.Service;


import iewa.api.Config.ApiResponseDTO;
import iewa.api.Config.JwtUtil;
import iewa.api.Config.MondayConfig;
import iewa.api.DTO.BusinessOwner.LoginBusinessOwnerDTO;
import iewa.api.DTO.BusinessOwner.RegisterBusinessOwnerDTO;
import iewa.api.Model.BusinessOwner;
import iewa.api.Model.Role;
import iewa.api.Model.User;
import iewa.api.Repository.BusinessOwnerRepository;
import iewa.api.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.*;

@Service
public class UserService implements UserDetailsService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private BusinessOwnerRepository businessOwnerRepository;


    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;



    
    @Autowired
    private UserRepository userRepository;


    @Autowired
    private MondayConfig mondayConfig;



    @Autowired
    private Monday monday;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
    }








    public ResponseEntity<?> registerBusinessOwner(RegisterBusinessOwnerDTO registerBusinessOwnerDTO) {
        try {
            BusinessOwner exists = businessOwnerRepository.findByEmail(registerBusinessOwnerDTO.getEmail());
            if (exists != null) {
                return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false, "المستخدم موجود بالفعل", null ,400));
            }

            Map<String, String> columnValues = new HashMap<>();
            columnValues.put("phone", registerBusinessOwnerDTO.getPhoneNumber());
            columnValues.put("email", registerBusinessOwnerDTO.getEmail() + " " + registerBusinessOwnerDTO.getEmail());
            columnValues.put("text", registerBusinessOwnerDTO.getFullName());




            BusinessOwner businessOwner = new BusinessOwner();
            businessOwner.setEmail(registerBusinessOwnerDTO.getEmail());
            businessOwner.setPhoneNumber(registerBusinessOwnerDTO.getPhoneNumber());
            businessOwner.setPassword(passwordEncoder.encode(registerBusinessOwnerDTO.getPassword()));
            businessOwner.setName(registerBusinessOwnerDTO.getFullName());
            businessOwner.setRole(Role.BUSINESS_OWNER);
            businessOwner.setCompanyName(registerBusinessOwnerDTO.getCompany());



            String itemId = monday.createItem(1399424616, registerBusinessOwnerDTO.getCompany(), mondayConfig.getClientGroupId(), columnValues);
            businessOwner.setMondayId(itemId);

            businessOwnerRepository.save(businessOwner);
            String token = jwtUtil.generateToken(businessOwner.getEmail());


            return ResponseEntity.ok(new ApiResponseDTO<>(true, "تم تسجيل المستخدم بنجاح", token, 201));
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }



    }

    @Transactional
    public ResponseEntity<?> loginBusinessOwner(LoginBusinessOwnerDTO loginBusinessOwnerDTO) {
        try {
            BusinessOwner exists = businessOwnerRepository.findByEmail(loginBusinessOwnerDTO.getEmail());
            if (exists == null) {
                return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false, "المستخدم غير موجود", null, 400));
            }



            final String jwt = jwtUtil.generateToken(exists.getEmail());
            return ResponseEntity.ok(new ApiResponseDTO<>(true, "Business Owner logged in successfully", jwt, 200));

        } catch (BadCredentialsException e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false, "كلمة المرور او الايميل غير صحيحه", null, 400));
        } catch (UsernameNotFoundException e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false, "المستخدم غير موجود", null, 400));
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false, "حدث خطأ ما", null, 400));
        }
    }


}
