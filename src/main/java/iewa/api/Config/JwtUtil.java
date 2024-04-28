package iewa.api.Config;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.JWTParser;
import com.nimbusds.jwt.SignedJWT;
import iewa.api.Model.BusinessOwner;
import iewa.api.Repository.BusinessOwnerRepository;
import iewa.api.Repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);


    @Autowired
    private BusinessOwnerRepository businessOwnerRepository;
    private static final String SECRET = "secret01234567890ABCDEFGHIJKLMNO"; // secret key

    public String generateToken(String email) {
        try {
            BusinessOwner businessOwner = businessOwnerRepository.findByEmail(email);
            log.info("Business Owner: " + businessOwner.getRole());





            Date now = new Date();
            Date exp = new Date(now.getTime() + 1000L * 60 * 60 * 24 * 30);

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(email)
                    .claim("roles", businessOwner.getRole().getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                    .issueTime(now)
                    .expirationTime(exp)
                    .build();

            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
            signedJWT.sign(new MACSigner(SECRET));

            return signedJWT.serialize();
        } catch (JOSEException e) {
            log.error("Error signing the JWT", e);
        }
        return null;
    }



    public boolean validateToken(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SECRET);

        return signedJWT.verify(verifier) && new Date().before(signedJWT.getJWTClaimsSet().getExpirationTime());
    }

    public String getUsernameFromToken(String token) throws Exception {
        return JWTParser.parse(token).getJWTClaimsSet().getSubject();
    }

    public List<GrantedAuthority> getRolesFromToken(String token) throws ParseException {
        return JWTParser.parse(token).getJWTClaimsSet().getStringListClaim("roles").stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }

}