package com.librogeek.Controllers;

import com.librogeek.Services.UserService;
import com.librogeek.Utils.ApiResponse;
import com.librogeek.Models.User;

import com.librogeek.Utils.ServiceResult;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {


    private final UserService userService;


    public UserController( UserService userService) {

        this.userService = userService;

    }


//    @GetMapping
//    List<User> findAll() {
//        return userRepository.findAll();
//    }
//
//    @GetMapping("/{id}")
//    User findById(@PathVariable Integer id) {
//
//        Optional<User> user = userRepository.findById(id);
//        if (user.isEmpty()) {
//            System.out.println("User not found: throwing exception");
//            throw new UserNotFoundException();
//        }
//        return user.get();
//    }


    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody User user) {
        ServiceResult<User> result = userService.register(user);

        ApiResponse response = result.isSuccess()
                ? ApiResponse.success(result.getData(), result.getMessage())
                : ApiResponse.error(result.getMessage());

        HttpStatus status = result.isSuccess() ? HttpStatus.CREATED : HttpStatus.CONFLICT;
        return ResponseEntity.status(status).body(response);
    }



//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    @PutMapping("/api/users/{id}")
//    void update(@Valid @RequestBody User user, @PathVariable Integer id) {
//        userRepository.update(user, id);
//    }
//
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    @DeleteMapping("/api/users/{id}")
//    void delete(@Valid @PathVariable Integer id) {
//        userRepository.delete(id);
//    }

}
