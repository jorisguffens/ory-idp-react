<?php


namespace App;


use App\Domain\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Psr\Http\Message\ResponseInterface;

class Queries
{

    public static function response($response, $data): ResponseInterface
    {
        if ( empty($data) ) {
            return Responses::error404($response);
        }

        if  ( $data instanceof Collection && $data->isEmpty() ) {
            return Responses::error404($response);
        }

        return Responses::success($response, $data);
    }

    /**
     *
     * Use query params for pagination & filtering
     *
     * @param Builder $query
     * @param array $params
     */
    public static function applyParams(Builder $query, array $params) {
        if ( $params == null ) {
            return;
        }

        if ( isset($params["pagesize"]) ) {
            $pagesize = $params["pagesize"];
            unset($params["pagesize"]);

            $query->limit($pagesize);

            if ( isset($params["page"]) ) {
                $query->offset($params["page"] * $pagesize);
                unset($params["page"]);
            }
        }

        foreach ( $params as $key => $value ) {

            if ( gettype($value) == 'integer' ) {
                $query->where($key, '=', $value);
                continue;
            }

            if ( gettype($value) == 'string' ) {
                $value = preg_replace("/[^A-Za-z0-9 ]/", '', $value);
                $query->where($key, 'like', '%' . $value . '%');
                continue;
            }

            if ( gettype($value) == 'boolean' ) {
                $query->where($key, '=', $value == true ? 1 : 0);
                continue;
            }

        }
    }

    /**
     * Only show objects the user has access to (objects have one user)
     *
     * @param Builder $query
     * @param User|null $user
     */
    public static function protectResult(Builder $query, User $user = null)
    {
        if ( $user = null ) {
            return;
        }

        if ( $user->admin ) {
            return;
        }

        $query->whereHas("user", function ($query) use ($user) {
            $query->where("id", "=", $user->id);
        });
    }

    /**
     * Only show objects the user has access to (user has one object)
     *
     * @param Builder $query
     * @param User|null $user
     * @param string|null $field
     */
    public static function protectResultOne(Builder $query, User $user = null, string $field = null)
    {
        if ( $user = null ) {
            return;
        }

        if ( $user->admin ) {
            return;
        }

        $query->join("users", $field, "=", "id");
    }

}