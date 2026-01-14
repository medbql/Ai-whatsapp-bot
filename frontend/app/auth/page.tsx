'use client'
import { api } from "@/axios/config"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChangeEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { userData } from "@/src/authContext"



const LoginCard = ({isRegister  } : { isRegister : () => void}) =>{
    interface FormState{
        email : string;
        password : string;
    }
   const {isAuthenticetd} = userData();
const router = useRouter();

    const [from, setForm] = useState<FormState>({
        email : '',
        password : ''        
    })

    const handelChange = (e : ChangeEvent<HTMLInputElement>) =>{
        const  { name, value} = e.target;
        setForm ((prev) =>({ ...prev, [name] : value}))
    }

    const onSubmit = async () => {
        await api.post('/auth/login',from).then(
            ({status, data})=>{
                if (status === 200) {
                    localStorage.setItem('Token', data.user.accessToken);
                    isAuthenticetd('true')
                    router.push('/dashboard')
                };
            }
        )
    }

    return(
 <Card className="w-1/4 m-auto mt-20">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
  <form method="post"  >
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                name="email"
                value={from.email}
                onChange={handelChange}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
             
                <label htmlFor="password">Password</label>
              
     
              <Input id="password" type="password" name="password" value={from.password} onChange={handelChange} required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={onSubmit} type="submit" className="w-full">
          Login
        </Button>
        <Button onClick={ isRegister}  variant="link" className="w-full">
            Register        
        </Button>
      
      </CardFooter>
    </Card>
    )
}

const RegisterCard = ({islogin}:{islogin : () => void}) =>{
    interface FormState{
        firstName : string;
        lastName : string;
        email : string;
        password : string;
    }

    const [from, setForm] = useState<FormState>({
        firstName : '',
        lastName : '',
        email : '',
        password : ''        
    })

    const handelChange = (e : ChangeEvent<HTMLInputElement>) =>{
        const  { name, value} = e.target;
        setForm ((prev) =>({ ...prev, [name] : value}))
    }

    const onSubmit = async () =>{
        await api.post('/auth/register',from).then(
            ({status, data})=>{
                status === 201 && islogin();
            }
        )
    }

 return(
 <Card className="w-1/4 m-auto mt-20">
      <CardHeader>
        <CardTitle>Craete your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
  <form method="post" >
          <div className="flex flex-col gap-6">
            
               <div className="grid gap-2">
             
                <label htmlFor="FirstName">First Name</label>
              
     
              <Input id="FirstName" type="text" name="firstName" value={from.firstName} onChange={handelChange} required />
            </div>
               <div className="grid gap-2">
             
                <label htmlFor="LastName">Last Name</label>
              
     
              <Input id="LastName" type="text" name="lastName" value={from.lastName} onChange={handelChange} required />
            </div>
 <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                value={from.email}
                onChange={handelChange}
                required
              />
            </div>
            <div className="grid gap-2">
             
                <label htmlFor="password">Password</label>
              
     
              <Input id="password" type="password" name="password" value={from.password} onChange={handelChange} required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={onSubmit}  type="submit" className="w-full">
          Rgister
        </Button>
        <Button onClick={islogin} variant="link" className="w-full">
            Login       
        </Button>
      
      </CardFooter>
    </Card>
 )
}

export default function LoginPage() {
   const [isLogin, setLogin] = useState<boolean>(true); 
  const {authenticated} = userData();
  const router = useRouter();

  useEffect(()=>{
    if (authenticated === 'true') {
      router.replace('/dashboard')
    }
  },[authenticated])

   return (
    <>
    {  isLogin ? <LoginCard isRegister={()=> setLogin(false)} /> : <RegisterCard islogin={() => setLogin(true)}  />}
  </>
  )
}

