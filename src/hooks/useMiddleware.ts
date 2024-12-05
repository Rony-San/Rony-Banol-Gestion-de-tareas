import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ME_QUERY } from "@/utils/graphql/queries/auth";
import { Role, UserProps } from "@/utils/enums";

export default function useMiddleware(role: Role): UserProps | null {
  const router = useRouter();
  const { data, loading: queryLoading } = useQuery(ME_QUERY);

  useEffect(() => {
    if (!queryLoading && !data?.me) {
      router.push("/");
    } else if (!queryLoading && data?.me) {
      if (role === Role.ADMIN && data.me.role !== Role.ADMIN) {
        router.push("/");
      }
    }
  }, [data, queryLoading, router]);

  return data?.me;
}
